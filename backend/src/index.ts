import 'dotenv/config';
import app from './app';
import { isEmailConfigured, verifyEmailConnection } from './services/email.service';

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Techloom API running on port ${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/api/docs`);

  if (!isEmailConfigured()) {
    console.warn('[Email] SMTP not configured — contact form saves messages but will NOT send email.');
    console.warn('[Email] Run: .\\setup-email.ps1  (from project root)');
  } else {
    const check = await verifyEmailConnection();
    if (check.ok) {
      const inbox = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
      console.log(`[Email] SMTP ready — contact messages go to ${inbox}`);
    } else {
      console.error(`[Email] SMTP configured but connection failed: ${check.reason}`);
    }
  }
});