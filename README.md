# Techloom Website

Next.js frontend + Express/Prisma API.

## Local dev

Double-click `START-TECHLOOM.bat` or:

```bash
cd backend && npm install && npx prisma db push && npm run db:seed && npm run dev
cd frontend && npm install && npm run dev
```

Admin: `admin@techloom.com` / `Admin@Techloom123`

---

## Deploy to production

**→ See [SIMPLE-DEPLOY.md](./SIMPLE-DEPLOY.md)** (Railway + Vercel, ~15 min)

| Service | Host |
|---------|------|
| Website | Vercel |
| API + Database | Railway |

---

## Project structure

```
techloom/
├── frontend/     # Next.js → Vercel
├── backend/      # Express API → Railway
└── SIMPLE-DEPLOY.md
```