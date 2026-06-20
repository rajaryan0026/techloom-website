# GoDaddy DNS for techloom.live

## 1. Vercel (website)

1. [vercel.com](https://vercel.com) → your project → **Settings → Domains**
2. Add **`techloom.live`** and **`www.techloom.live`**

## 2. GoDaddy DNS records

Go to [GoDaddy Domain Portfolio](https://dcc.godaddy.com/) → **techloom.live** → **DNS** → **DNS Records**

**Delete** any old A/CNAME records for `@` and `www` (parking page, etc.).

**Add these:**

| Type  | Name | Value                 | TTL  |
|-------|------|-----------------------|------|
| A     | @    | `76.76.21.21`         | 600  |
| CNAME | www  | `cname.vercel-dns.com`| 600  |

Save. Propagation: 10 minutes – 48 hours (usually under 1 hour).

## 3. Vercel — Environment variables

Vercel project → **Settings → Environment Variables** (or import `frontend/vercel.env.import`):

```
NEXT_PUBLIC_SITE_URL=https://www.techloom.live
NEXT_PUBLIC_API_URL=https://asia-south1-YOUR_PROJECT.cloudfunctions.net/api/api
INTERNAL_API_URL=https://asia-south1-YOUR_PROJECT.cloudfunctions.net/api/api
NEXT_PUBLIC_WHATSAPP_NUMBER=919709991060
NEXT_PUBLIC_PHONE=+919709991060
NEXT_PUBLIC_INSTAGRAM=techloom00
```

Replace `YOUR_PROJECT` with your Firebase project id (e.g. `techloom-live`).

Redeploy Vercel after any env change.

## 4. Firebase API

API runs on Firebase Cloud Functions — see **[FIREBASE-DEPLOY.md](./FIREBASE-DEPLOY.md)**.

Default API URL pattern:

```
https://asia-south1-techloom-live.cloudfunctions.net/api
```

Health check:

```
https://asia-south1-techloom-live.cloudfunctions.net/api/health
```

## 5. Optional: API subdomain

To use `api.techloom.live`, connect it in Firebase Hosting custom domains or add a GoDaddy CNAME per Firebase instructions.

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