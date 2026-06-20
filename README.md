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

| Service | Host | Purpose |
|---------|------|---------|
| Frontend | [Vercel](https://vercel.com) | Next.js site + custom domain |
| API | [Firebase Functions](https://firebase.google.com) | Express backend |
| Database | [Neon](https://neon.tech) | PostgreSQL (free) |

See **[FIREBASE-DEPLOY.md](./FIREBASE-DEPLOY.md)** for full API deploy steps.

### Quick deploy

```powershell
# 1. Neon Postgres + seed (see FIREBASE-DEPLOY.md)
# 2. Firebase project + functions/.env
.\deploy-firebase.ps1

# 3. Vercel — set NEXT_PUBLIC_API_URL to your Firebase function URL
#    https://asia-south1-techloom-48db5.cloudfunctions.net/api/api
```

### Vercel env vars

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://asia-south1-techloom-48db5.cloudfunctions.net/api/api` |
| `INTERNAL_API_URL` | same as above |
| `NEXT_PUBLIC_SITE_URL` | `https://www.techloom.live` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919709991060` |
| `NEXT_PUBLIC_PHONE` | `+919709991060` |

### Domain (GoDaddy)

See **[GODADDY-DNS.md](./GODADDY-DNS.md)** for `techloom.live` DNS on Vercel.

---

## Project structure

```
techloom/
├── frontend/           # Next.js (Vercel)
├── backend/            # Express API source
├── functions/          # Firebase Cloud Functions wrapper
├── firebase.json       # Firebase config
├── deploy-firebase.ps1 # One-command API deploy
├── FIREBASE-DEPLOY.md  # API deploy guide
└── START-TECHLOOM.bat  # Local Windows launcher
```

## Environment variables

See `backend/.env.example`, `functions/.env.example`, and `frontend/.env.example`.

**Never commit `.env` or `.env.local` files.**