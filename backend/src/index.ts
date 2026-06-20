import 'dotenv/config';
import app from './app';
import { getEmailProvider, isEmailConfigured, verifyEmailConnection } from './services/email.service';

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Techloom API running on port ${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/api/docs`);

  if (!isEmailConfigured()) {
    console.warn('[Email] Not configured — contact form saves messages but will NOT send email.');
    console.warn('[Email] Production: set RESEND_API_KEY on Railway. Local: run .\\setup-email.ps1');
  } else {
    const provider = getEmailProvider();
    const check = await verifyEmailConnection();
    if (check.ok) {
      const inbox = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      console.log(`[Email] ${provider} ready — contact messages go to ${inbox}`);
    } else {
      console.error(`[Email] ${provider} configured but connection failed: ${check.reason}`);
    }
  }
});