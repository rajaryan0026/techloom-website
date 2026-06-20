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

## 3. Vercel environment variables

Project → **Settings → Environment Variables**:

```
NEXT_PUBLIC_SITE_URL=https://www.techloom.live
NEXT_PUBLIC_API_URL=https://techloom-api.onrender.com/api
INTERNAL_API_URL=https://techloom-api.onrender.com/api
NEXT_PUBLIC_WHATSAPP_NUMBER=919709991060
NEXT_PUBLIC_PHONE=+919709991060
NEXT_PUBLIC_INSTAGRAM=techloom00
```

Redeploy after saving.

## 4. Render (API) environment variables

On **techloom-api** service:

```
FRONTEND_URL=https://www.techloom.live
CORS_ORIGIN=https://www.techloom.live
```

(Also set SMTP and `ADMIN_PASSWORD` for production.)

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