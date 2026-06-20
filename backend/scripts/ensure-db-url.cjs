// Prisma requires DATABASE_URL to exist at generate time (build).
// Railway build may run before Postgres is linked — use a harmless placeholder.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://build:build@localhost:5432/build?schema=public';
}