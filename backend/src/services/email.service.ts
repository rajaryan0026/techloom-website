import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

type EmailProvider = 'resend' | 'smtp';

let transporter: Transporter | null = null;

function getProvider(): EmailProvider | null {
  if (process.env.RESEND_API_KEY?.trim()) return 'resend';
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp';
  return null;
}

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS!.replace(/\s/g, ''),
    },
    tls: { minVersion: 'TLSv1.2' },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

function getFromAddress() {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (getProvider() === 'resend') {
    // Use onboarding sender until techloom.live is verified on Resend.
    return 'Techloom <onboarding@resend.dev>';
  }
  return `Techloom <${process.env.SMTP_USER}>`;
}

export function getEmailProvider() {
  return getProvider();
}

export function isEmailConfigured() {
  return getProvider() !== null;
}

async function verifyResendConnection() {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 401 || res.status === 403) {
      const payload = await res.json().catch(() => ({})) as { message?: string; name?: string };
      // Send-only keys cannot list domains but can still send mail.
      if (payload.name === 'restricted_api_key') {
        return { ok: true, reason: null, sendOnlyKey: true };
      }
      return { ok: false, reason: 'Invalid RESEND_API_KEY' };
    }
    if (!res.ok) {
      return { ok: false, reason: `Resend API error (${res.status})` };
    }

    return { ok: true, reason: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Resend error';
    return { ok: false, reason: message };
  }
}

export async function verifyEmailConnection() {
  const provider = getProvider();
  if (!provider) {
    return { ok: false, reason: 'Set RESEND_API_KEY (production) or SMTP_USER + SMTP_PASS (local)' };
  }

  if (provider === 'resend') {
    const result = await verifyResendConnection();
    return { ...result, provider };
  }

  const t = getTransporter();
  if (!t) return { ok: false, reason: 'SMTP_USER and SMTP_PASS not set', provider };

  try {
    await t.verify();
    return { ok: true, reason: null, provider };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown SMTP error';
    return { ok: false, reason: message, provider };
  }
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  options?: { replyTo?: string }
) {
  const body: Record<string, unknown> = {
    from: getFromAddress(),
    to: [to],
    subject,
    html,
  };
  if (options?.replyTo) body.reply_to = options.replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(payload.message || `Resend API error (${res.status})`);
  }
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string,
  options?: { replyTo?: string }
) {
  const t = getTransporter();
  if (!t) throw new Error('SMTP not configured');

  await t.sendMail({
    from: getFromAddress(),
    to,
    replyTo: options?.replyTo,
    subject,
    html,
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: { replyTo?: string }
) {
  const provider = getProvider();
  if (!provider) {
    console.warn('[Email] Not configured. Set RESEND_API_KEY or SMTP_USER + SMTP_PASS.');
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { sent: false, mock: true, error: 'Email not configured' };
  }

  try {
    if (provider === 'resend') {
      await sendViaResend(to, subject, html, options);
    } else {
      await sendViaSmtp(to, subject, html, options);
    }
    return { sent: true, mock: false, provider };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email';
    console.error(`[Email] Failed to send to ${to} via ${provider}:`, message);
    return { sent: false, mock: false, error: message, provider };
  }
}

export function contactNotificationHtml(data: Record<string, string | undefined>) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:16px">
      <div style="background:#7C3AED;color:white;padding:20px 24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;font-size:20px">New Contact Form Message</h2>
        <p style="margin:8px 0 0;opacity:0.9;font-size:14px">Techloom Website</p>
      </div>
      <div style="background:white;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#71717A;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${data.name}</td></tr>
          <tr><td style="padding:8px 0;color:#71717A">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#71717A">Phone</td><td style="padding:8px 0">${data.phone || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:#71717A">Company</td><td style="padding:8px 0">${data.company || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:#71717A">Service</td><td style="padding:8px 0">${data.service || 'General Inquiry'}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#f5f3ff;border-radius:8px;border-left:4px solid #7C3AED">
          <p style="margin:0 0 8px;color:#71717A;font-size:12px;text-transform:uppercase">Message</p>
          <p style="margin:0;white-space:pre-wrap;line-height:1.6">${data.message || 'N/A'}</p>
        </div>
      </div>
    </div>
  `;
}

export function contactConfirmationHtml(name: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px">
      <h1 style="color:#7C3AED;margin-bottom:8px">Thank you, ${name}!</h1>
      <p style="color:#374151;line-height:1.6">We received your message and will get back to you within 24 hours.</p>
      <p style="color:#71717A;font-size:14px;margin-top:32px">— Techloom Team<br>Where Technology Meets Trust</p>
    </div>
  `;
}

export function verificationEmailHtml(name: string, link: string) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px">
      <h1 style="color:#7C3AED">Welcome to Techloom</h1>
      <p>Hi ${name}, verify your email to get started.</p>
      <a href="${link}" style="display:inline-block;background:#7C3AED;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:20px 0">Verify Email</a>
    </div>
  `;
}

export function resetPasswordEmailHtml(name: string, link: string) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px">
      <h1 style="color:#7C3AED">Reset Your Password</h1>
      <p>Hi ${name}, click below to reset your password. Link expires in 1 hour.</p>
      <a href="${link}" style="display:inline-block;background:#7C3AED;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:20px 0">Reset Password</a>
    </div>
  `;
}

export async function sendContactEmails(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
}) {
  const adminEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || 'admin@techloom.com';

  const adminResult = await sendEmail(
    adminEmail,
    `New Contact: ${data.name} — Techloom`,
    contactNotificationHtml({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    }),
    { replyTo: data.email }
  );

  const userResult = await sendEmail(
    data.email,
    'We received your message — Techloom',
    contactConfirmationHtml(data.name)
  );

  return { adminResult, userResult };
}