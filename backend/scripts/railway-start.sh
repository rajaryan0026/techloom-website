#!/usr/bin/env sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo ""
  echo "ERROR: DATABASE_URL is not set."
  echo ""
  echo "Railway fix:"
  echo "  1. Add a PostgreSQL database to this project"
  echo "  2. Open the backend service → Variables"
  echo "  3. New Variable → Reference → Postgres → DATABASE_URL"
  echo "  4. Redeploy"
  echo ""
  exit 1
fi

npx prisma db push
npm run db:seed
npm start