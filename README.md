# Techloom Website

Full-stack marketing site for Techloom — Next.js frontend + Express/Prisma API.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, Tailwind, Framer Motion |
| Backend | Express, Prisma, PostgreSQL |
| Auth | JWT + refresh cookies |

## Local development

```bash
# 1. Backend
cd backend
cp .env.example .env        # edit DATABASE_URL, SMTP, etc.
npm install
npx prisma db push
npm run db:seed
npm run dev                 # http://localhost:4000

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

Or double-click `START-TECHLOOM.bat` on Windows.

**Admin login:** `admin@techloom.com` / `Admin@Techloom123`

---

## Deploy to production

Recommended setup (free tier friendly):

| Service | Host | Purpose |
|---------|------|---------|
| Frontend | [Vercel](https://vercel.com) | Next.js site + custom domain |
| API | [Render](https://render.com) | Express backend |
| Database | Render Postgres (via `render.yaml`) | PostgreSQL |

### Step 1 — Push to GitHub

```powershell
.\push-to-github.ps1
```

Or manually:

```bash
git init
git add .
git commit -m "Initial commit: Techloom website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/techloom-website.git
git push -u origin main
```

Create the repo on GitHub first: **New repository → name: `techloom-website` → Private or Public → do NOT add README**.

### Step 2 — Deploy API (Render)

1. Go to [render.com](https://render.com) → **New → Blueprint**
2. Connect your `techloom-website` GitHub repo
3. Render reads `render.yaml` and creates **techloom-api** + **techloom-db**
4. In Render dashboard, set these env vars on **techloom-api**:
   - `FRONTEND_URL` = `https://yourdomain.com` (or Vercel preview URL first)
   - `CORS_ORIGIN` = same as `FRONTEND_URL`
   - `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `CONTACT_EMAIL` (Gmail app password)
   - `ADMIN_PASSWORD` = strong production password
5. After deploy, note your API URL: `https://techloom-api.onrender.com`

Run seed once (Render shell):

```bash
npm run db:seed
```

### Step 3 — Deploy frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `techloom-website` from GitHub
3. Set **Root Directory** → `frontend`
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://techloom-api.onrender.com/api` |
| `INTERNAL_API_URL` | `https://techloom-api.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919709991060` |
| `NEXT_PUBLIC_PHONE` | `+919709991060` |
| `NEXT_PUBLIC_INSTAGRAM` | `techloom00` |

5. Deploy → you get `https://techloom-website.vercel.app`

### Step 4 — Connect your domain

**On Vercel (website):**

1. Project → **Settings → Domains**
2. Add `yourdomain.com` and `www.yourdomain.com`
3. Vercel shows DNS records — add them at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

Example DNS (Vercel):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Optional API subdomain** (e.g. `api.yourdomain.com`):

1. Render → **techloom-api** → Settings → Custom Domains → add `api.yourdomain.com`
2. Add CNAME at registrar pointing to Render's hostname
3. Update Vercel env vars to use `https://api.yourdomain.com/api`
4. Update Render `CORS_ORIGIN` and `FRONTEND_URL`

### Step 5 — Verify

- [ ] Homepage loads on your domain
- [ ] Contact form sends email
- [ ] Admin login works at `/auth/login`
- [ ] Admin panel CRUD (blogs, portfolio, testimonials, team)

---

## Project structure

```
techloom/
├── frontend/          # Next.js app (deploy to Vercel)
├── backend/           # Express API (deploy to Render)
├── render.yaml        # Render blueprint
├── START-TECHLOOM.bat # Local Windows launcher
└── setup-email.ps1    # Gmail SMTP setup helper
```

## Environment variables

See `backend/.env.example` and `frontend/.env.example`.

**Never commit `.env` or `.env.local` files.**