# Deploy Techloom API on Render

## Important — Render Build Command

If you created the service manually, set this in **techloom-api → Settings → Build & Deploy**:

| Field | Value |
|-------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npx prisma db push && npm run db:seed && npm start` |

Save, then **Manual Deploy → Deploy latest commit**.

> **Free tier has no Shell.** The start command above auto-creates the admin user and seeds data on every deploy (safe — uses upserts).

---

## Step 1 — Create Blueprint

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect GitHub → select **rajaryan0026/techloom-website**
4. Render detects `render.yaml` → click **Apply**

This creates:
- **techloom-db** (PostgreSQL)
- **techloom-api** (Express backend)

Wait until both show **Live** (first deploy ~5–10 min).

---

## Step 2 — Set environment variables

Open **techloom-api** → **Environment** → **Import from .env**

Paste from `backend/render.env.import` and **edit these**:

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `CONTACT_EMAIL` | `rajaryan2611@gmail.com` (where contact form alerts go) |
| `ADMIN_PASSWORD` | Strong password for admin login |
| `API_PUBLIC_URL` | `https://techloom-api.onrender.com` (your actual Render URL) |

Click **Save Changes** → service redeploys.

> `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` are auto-set by Blueprint — don't delete them.

### Email on Render (Resend — required)

Gmail SMTP (`smtp.gmail.com:587`) **times out on Render** — cloud hosts often block outbound SMTP.

Use **Resend** instead (HTTPS API, works on Render):

1. Sign up at [resend.com](https://resend.com) → **API Keys** → create key → paste as `RESEND_API_KEY` on Render.
2. **Domains** → add `techloom.live` → add the DNS records Resend shows in GoDaddy.
3. Wait until the domain shows **Verified**.
4. Set on Render:
   - `RESEND_API_KEY` = your Resend API key
   - `EMAIL_FROM` = `Techloom <onboarding@resend.dev>` (until domain is verified)
   - `CONTACT_EMAIL` = `rajaryan2611@gmail.com`
5. Remove `SMTP_USER` / `SMTP_PASS` from Render if present (Resend takes priority when `RESEND_API_KEY` is set).

**Interim (domain not verified yet):** `onboarding@resend.dev` only delivers to your Resend account email — contact alerts to `rajaryan2611@gmail.com` work; visitor confirmation emails do not.

**After domain verified:** change `EMAIL_FROM` to `Techloom <notifications@techloom.live>` and redeploy — then both admin + visitor emails work.

After deploy, check `https://techloom-api.onrender.com/health` — expect `"email": { "configured": true, "provider": "resend", "ok": true }`.

Local dev can still use Gmail via `.\setup-email.ps1` (no `RESEND_API_KEY` in `backend/.env`).

---

## Step 3 — Admin login (auto-seeded on start)

Set on **techloom-api** → **Environment**:

| Variable | Value |
|----------|-------|
| `ADMIN_EMAIL` | `admin@techloom.com` |
| `ADMIN_PASSWORD` | Your chosen password |

Redeploy — the **Start Command** runs `db:seed` automatically and creates/resets the admin user.

**Login:** `admin@techloom.com` + your `ADMIN_PASSWORD` (default `Admin@Techloom123` if unset).

---

## Step 4 — Verify API

Open in browser:

```
https://techloom-api.onrender.com/health
```

Expected: `{"status":"ok","service":"techloom-api"}`

Also test:

```
https://techloom-api.onrender.com/api/services
```

---

## Step 5 — Connect Vercel frontend

Vercel project → **Settings → Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://techloom-api.onrender.com/api
INTERNAL_API_URL=https://techloom-api.onrender.com/api
NEXT_PUBLIC_WHATSAPP_NUMBER=919709991060
NEXT_PUBLIC_PHONE=+919709991060
```

**Redeploy** the Vercel project.

---

## Step 6 — Test live site

- https://www.techloom.live — homepage loads data
- https://www.techloom.live/contact — form sends email
- https://www.techloom.live/auth/login — `admin@techloom.com` + your `ADMIN_PASSWORD`

---

## Optional: custom API domain

Render → **techloom-api** → **Settings → Custom Domains** → `api.techloom.live`

GoDaddy DNS:

| Type | Name | Value |
|------|------|-------|
| CNAME | api | `techloom-api.onrender.com` |

Then update Vercel:

```
NEXT_PUBLIC_API_URL=https://api.techloom.live/api
INTERNAL_API_URL=https://api.techloom.live/api
```

And Render `API_PUBLIC_URL=https://api.techloom.live`

---

## Notes

- **Free tier** API sleeps after 15 min idle — first request may take ~30s (cold start).
- **Uploads** on free tier use ephemeral disk; for production media use Cloudinary (set env vars in Render).