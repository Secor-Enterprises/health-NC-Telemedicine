# Caretide Backend — Express + Prisma + Postgres

REST API implementing the contract in `../openapi.yaml`. Designed for onsite hosting.

## Stack
- Node.js 20+ / TypeScript
- Express 4
- Prisma 5 + PostgreSQL 16
- JWT auth (bcrypt-hashed passwords)
- Multer for file uploads (local disk; swap for S3/MinIO if desired)

## Quick start (local)

```bash
cd backend
cp .env.example .env          # edit DATABASE_URL + JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run seed                  # creates demo doctor + patient
npm run dev                   # http://localhost:8080
```

## Quick start (Docker)

```bash
cd backend
docker compose up --build
# API: http://localhost:8080  | DB: localhost:5432
```

## Wire the frontend

In the React app root, set:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Then replace the mock implementations in `src/lib/api.ts` with `fetch()` calls
(template provided in that file's `request<T>()` helper).

## Endpoints

All routes mounted under `/api`. See `../openapi.yaml` for the full spec.

| Method | Path                  | Auth        |
| ------ | --------------------- | ----------- |
| POST   | /auth/login           | public      |
| POST   | /auth/register        | public      |
| POST   | /auth/logout          | any         |
| GET    | /auth/me              | any         |
| GET    | /doctors              | any         |
| GET    | /patients             | doctor/admin|
| GET    | /appointments         | any (scoped)|
| POST   | /appointments         | any         |
| PATCH  | /appointments/:id     | participant or admin |
| GET    | /records?patientId=   | own or doctor/admin |
| POST   | /records              | doctor/admin|
| GET    | /files?patientId=     | own or doctor/admin |
| POST   | /files (multipart)    | own or doctor/admin |

Uploaded files served from `/uploads/*`.

## Production checklist
- [ ] Set a strong `JWT_SECRET` (32+ random bytes)
- [ ] Use a managed Postgres or pin a Postgres version + backups
- [ ] Put behind HTTPS reverse proxy (nginx, Caddy, Traefik)
- [ ] Restrict `CORS_ORIGIN` to your frontend domain
- [ ] Move uploads to object storage (S3/MinIO) and stream via signed URLs
- [ ] Add rate limiting (e.g. `express-rate-limit`) on `/auth/*`
- [ ] Audit logging for record/file access (HIPAA)
- [ ] Run `prisma migrate deploy` (not `dev`) in production
