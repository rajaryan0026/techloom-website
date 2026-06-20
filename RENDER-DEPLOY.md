# Deploy Techloom API on Render

## Important — Render Build Command

If you created the service manually, set this in **techloom-api → Settings → Build & Deploy**:

| Field | Value |
|-------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npx prisma db push && npm start` |

Save, then **Manual Deploy → Deploy latest commit**.

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
| `SMTP_PASS` | Your Gmail app password |
| `ADMIN_PASSWORD` | Strong password for admin login |
| `API_PUBLIC_URL` | `https://techloom-api.onrender.com` (your actual Render URL) |

Click **Save Changes** → service redeploys.

> `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` are auto-set by Blueprint — don't delete them.

---

## Step 3 — Seed the database (once)

**techloom-api** → **Shell** tab:

```bash
npm run db:seed
```

You should see: `Seed complete. Admin: admin@techloom.com`

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