/**
 * Quick Resend smoke test.
 *
 * 1. Set RESEND_API_KEY in backend/.env (replace re_xxxxxxxxx with your real key)
 * 2. Run: npx tsx scripts/test-resend.ts
 */
import 'dotenv/config';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey || apiKey === 're_xxxxxxxxx') {
  console.error('Set RESEND_API_KEY in backend/.env — replace re_xxxxxxxxx with your real API key.');
  process.exit(1);
}

const resend = new Resend(apiKey);
const to = process.env.CONTACT_EMAIL || 'rajaryan2611@gmail.com';
const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: 'Hello World — Techloom Resend test',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
});

if (error) {
  console.error('Send failed:', error.message);
  process.exit(1);
}

console.log('Email sent:', data?.id);