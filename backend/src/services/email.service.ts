import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

export function isEmailConfigured() {
  return Boolean(getTransporter());
}

export async function verifyEmailConnection() {
  const t = getTransporter();
  if (!t) return { ok: false, reason: 'SMTP_USER and SMTP_PASS not set in backend/.env' };
  try {
    await t.verify();
    return { ok: true, reason: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown SMTP error';
    return { ok: false, reason: message };
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: { replyTo?: string }
) {
  const t = getTransporter();
  if (!t) {
    console.warn('[Email] SMTP not configured. Run setup-email.ps1 or set SMTP_USER and SMTP_PASS in backend/.env');
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { sent: false, mock: true, error: 'SMTP not configured' };
  }

  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || `Techloom <${process.env.SMTP_USER}>`,
      to,
      replyTo: options?.replyTo,
      subject,
      html,
    });
    return { sent: true, mock: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email';
    console.error(`[Email] Failed to send to ${to}:`, message);
    return { sent: false, mock: false, error: message };
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