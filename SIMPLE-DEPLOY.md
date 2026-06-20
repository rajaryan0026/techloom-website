# Techloom — Simple Deploy (15 minutes)

**2 services total:** Railway (API + database) + Vercel (website). That's it.

| What | Where |
|------|-------|
| Website | Vercel → `www.techloom.live` |
| API + Postgres | Railway → one project, auto-linked |

Email uses **Resend** (already set up). No Firebase, no Neon, no separate database signup.

---

## Step 1 — Railway (API + database)

1. Go to [railway.app](https://railway.app) → sign in with GitHub
2. **New Project** → **Deploy from GitHub repo** → select `techloom-website`
3. Click the new service → **Settings**:
   - **Root Directory** → `backend`
   - **Start Command** → `npx prisma db push && npm run db:seed && npm start`
4. In the same project: **+ New** → **Database** → **PostgreSQL**
5. **Link database to backend** (this fixes `DATABASE_URL not found`):
   - Click the **backend** service (not Postgres)
   - **Variables** tab → **+ New Variable** → **Add Reference**
   - Service: **Postgres** (your database) → Variable: **DATABASE_URL**
   - Save
6. Still on **backend** → **Variables** → **RAW Editor** → paste from `backend/railway.env.import` and fill in:

| Variable | What to put |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend key |
| `ADMIN_PASSWORD` | Password for admin login |
| `JWT_SECRET` | Any random 32+ character string |
| `JWT_REFRESH_SECRET` | Another random 32+ character string |

> Do **not** skip step 5 — without the Postgres reference, deploy fails with `Environment variable not found: DATABASE_URL`.

7. **Redeploy** the backend service → wait until **Active**
8. **Settings → Networking → Generate Domain** → copy URL, e.g. `https://techloom-api-production.up.railway.app`

**Test:** open `https://YOUR-RAILWAY-URL.up.railway.app/health` → should show `"status":"ok"`

---

## Step 2 — Vercel (website)

Vercel project → **Settings → Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
INTERNAL_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://www.techloom.live
NEXT_PUBLIC_WHATSAPP_NUMBER=919709991060
NEXT_PUBLIC_PHONE=+919709991060
```

**Redeploy** Vercel.

---

## Step 3 — Test

- https://www.techloom.live — homepage loads
- https://www.techloom.live/contact — send a test message
- https://www.techloom.live/auth/login — `admin@techloom.com` + your `ADMIN_PASSWORD`

---

## Done

**Admin:** `admin@techloom.com` / your `ADMIN_PASSWORD`

**Ignore** Firebase / Render / Neon setup files — you don't need them with Railway.

If something breaks, check Railway **Deploy Logs** (build errors) or **HTTP Logs** (runtime errors).