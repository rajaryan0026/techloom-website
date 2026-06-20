# Deploy Techloom API on Firebase

Express backend runs as a **Firebase Cloud Function** (HTTPS). No Render.

| Service | Host |
|---------|------|
| Frontend | Vercel → `www.techloom.live` |
| API | Firebase Functions → `asia-south1` |
| Database | [Neon](https://neon.tech) Postgres (free) |

---

## Step 1 — Database (Neon)

Render Postgres is gone — use Neon (free, works with Prisma):

1. [neon.tech](https://neon.tech) → sign up → **New Project** → name `techloom`
2. Copy the **connection string** (use the **pooled** URL if offered)
3. Append `?sslmode=require` if not present

Save as `DATABASE_URL` — you'll need it in Step 3.

### Seed the database (run once from your PC)

```powershell
cd backend
# Set DATABASE_URL in backend\.env to your Neon URL, then:
npm install
npx prisma db push
npm run db:seed
```

Admin login after seed: `admin@techloom.com` + your `ADMIN_PASSWORD`.

---

## Step 2 — Firebase project

1. Firebase project: **`techloom-48db5`** — [console.firebase.google.com](https://console.firebase.google.com/project/techloom-48db5)
2. Upgrade to **Blaze (pay-as-you-go)** — required for Cloud Functions outbound network (Resend, Neon). You stay in free tier limits for low traffic.
3. Install Firebase CLI:

```powershell
npm install -g firebase-tools
firebase login
```

4. Link project (edit `.firebaserc` if your project id differs):

```powershell
cd C:\Users\rajar\projects\techloom
firebase use techloom-48db5
```

---

## Step 3 — Environment variables

Copy the template and fill in real values:

```powershell
copy functions\.env.example functions\.env
notepad functions\.env
```

**Required:**

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string |
| `JWT_SECRET` | Random 32+ char string |
| `JWT_REFRESH_SECRET` | Another random 32+ char string |
| `RESEND_API_KEY` | Your Resend key |
| `CONTACT_EMAIL` | `rajaryan2611@gmail.com` |
| `ADMIN_PASSWORD` | Strong admin password |
| `FRONTEND_URL` | `https://www.techloom.live` |
| `CORS_ORIGIN` | `https://www.techloom.live,https://techloom.live` |

Firebase automatically loads `functions/.env` on deploy.

---

## Step 4 — Deploy API

```powershell
.\deploy-firebase.ps1
```

Or manually:

```powershell
firebase deploy --only functions
```

After deploy, note your API base URL from the CLI output:

```
https://asia-south1-techloom-48db5.cloudfunctions.net/api
```

Your frontend should use:

```
NEXT_PUBLIC_API_URL=https://asia-south1-techloom-48db5.cloudfunctions.net/api/api
INTERNAL_API_URL=https://asia-south1-techloom-48db5.cloudfunctions.net/api/api
```

> Function name is `api`, Express routes start with `/api` — so the URL has `/api/api`.

Set `API_PUBLIC_URL` in `functions/.env` to the function URL (without trailing `/api`) and redeploy if you use file uploads.

---

## Step 5 — Update Vercel

Vercel → project → **Settings → Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://asia-south1-techloom-48db5.cloudfunctions.net/api/api
INTERNAL_API_URL=https://asia-south1-techloom-48db5.cloudfunctions.net/api/api
```

Redeploy Vercel.

---

## Step 6 — Verify

```text
https://asia-south1-techloom-48db5.cloudfunctions.net/api/health
https://asia-south1-techloom-48db5.cloudfunctions.net/api/api/services
```

- https://www.techloom.live — homepage
- https://www.techloom.live/contact — form works
- https://www.techloom.live/auth/login — admin login

---

## Optional: custom API domain (`api.techloom.live`)

1. Firebase Console → **Hosting** → add site or use existing
2. Connect `api.techloom.live` in Firebase Hosting custom domains
3. Add rewrite in `firebase.json` hosting section, or point GoDaddy CNAME to Firebase

Then set Vercel `NEXT_PUBLIC_API_URL=https://api.techloom.live/api`.

---

## Remove Render

1. [dashboard.render.com](https://dashboard.render.com) → delete **techloom-api** and **techloom-db**
2. Done — `render.yaml` and Render docs are removed from this repo

---

## Notes

- **Uploads:** Cloud Functions have no persistent disk — use **Cloudinary** (set env vars in `functions/.env`) for admin media uploads.
- **Cold starts:** First request after idle may take 5–15s (faster than Render free tier).
- **Logs:** `firebase functions:log` or Firebase Console → Functions → Logs.