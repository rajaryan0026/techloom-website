# GoDaddy DNS for techloom.live

## Website (Vercel)

GoDaddy → **techloom.live** → **DNS**:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | `76.76.21.21`          |
| CNAME | www  | `cname.vercel-dns.com` |

Vercel → project → **Settings → Domains** → add `techloom.live` and `www.techloom.live`

## API (Railway)

See **[SIMPLE-DEPLOY.md](./SIMPLE-DEPLOY.md)** — no DNS needed for API. Use the Railway URL in Vercel env vars.

## Vercel env vars

```
NEXT_PUBLIC_SITE_URL=https://www.techloom.live
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
INTERNAL_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
```