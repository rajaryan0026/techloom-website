# GoDaddy DNS for techloom.live

## 1. Vercel (website)

1. [vercel.com](https://vercel.com) → your project → **Settings → Domains**
2. Add **`techloom.live`** and **`www.techloom.live`**
3. Vercel may ask you to verify — use the records below

## 2. GoDaddy DNS records

Go to [GoDaddy Domain Portfolio](https://dcc.godaddy.com/) → **techloom.live** → **DNS** → **DNS Records**

**Delete** any old A/CNAME records for `@` and `www` (parking page, etc.).

**Add these:**

| Type  | Name | Value                 | TTL  |
|-------|------|-----------------------|------|
| A     | @    | `76.76.21.21`         | 600  |
| CNAME | www  | `cname.vercel-dns.com`| 600  |

Save. Propagation: 10 minutes – 48 hours (usually under 1 hour).

## 3. Vercel — Import .env

When importing the GitHub repo on Vercel:

1. Set **Root Directory** → `frontend`
2. Click **Environment Variables** → **Import .env**
3. Upload or paste from `frontend/vercel.env.import`:

```
NEXT_PUBLIC_SITE_URL=https://www.techloom.live
NEXT_PUBLIC_API_URL=https://techloom-api.onrender.com/api
INTERNAL_API_URL=https://techloom-api.onrender.com/api
```

> Use the **direct Render URL** (not `/api`). Vercel proxy can timeout when Render free tier wakes from sleep.
NEXT_PUBLIC_WHATSAPP_NUMBER=919709991060
NEXT_PUBLIC_PHONE=+919709991060
NEXT_PUBLIC_INSTAGRAM=techloom00
```

4. Deploy

> After Render API is live, update `NEXT_PUBLIC_API_URL` if your API URL is different.

Redeploy after any env change.

## 4. Render — Import .env (API)

On **techloom-api** → **Environment** → **Import from .env**:

Use `backend/render.env.import` — **edit `SMTP_PASS` and `ADMIN_PASSWORD` first**, then import.

`DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are created automatically by `render.yaml` — do not overwrite those.

## 5. Optional: API subdomain

Render → **techloom-api** → **Settings → Custom Domains** → add `api.techloom.live`

GoDaddy DNS:

| Type  | Name | Value (from Render)   |
|-------|------|------------------------|
| CNAME | api  | `techloom-api.onrender.com` |

Then update Vercel:

```
NEXT_PUBLIC_API_URL=https://api.techloom.live/api
INTERNAL_API_URL=https://api.techloom.live/api
```

## 6. Verify

- https://www.techloom.live loads
- https://techloom.live redirects to www (set in Vercel Domains)
- Contact form works
- Admin: https://www.techloom.live/auth/login