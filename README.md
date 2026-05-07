# Petstore (E-Commerce MVP)

Local development and Render deployment instructions.

Prerequisites
- Docker & Docker Compose
- Java 17 (optional if running backend locally)
- Maven (optional if running backend locally)
- Node 18+ & npm (optional if running frontend locally)

Run locally with Docker Compose

```powershell
docker-compose up --build
```

- Backend API: http://localhost:8080/api/v1/pets
- Frontend SPA: http://localhost:3000

Environment variables (for local or Render)
- `SPRING_DATASOURCE_URL` (default: `jdbc:postgresql://db:5432/petstore`)
- `SPRING_DATASOURCE_USERNAME` (default: `petstore`)
- `SPRING_DATASOURCE_PASSWORD` (default: `dev_password`)
- `JWT_SECRET` — JWT signing secret (must be >= 32 chars for HMAC)
- `STRIPE_SECRET` — Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret

Run backend locally (without Docker)

```powershell
cd backend
$env:SPRING_DATASOURCE_URL='jdbc:postgresql://127.0.0.1:5432/petstore'
$env:SPRING_DATASOURCE_USERNAME='petstore'
$env:SPRING_DATASOURCE_PASSWORD='dev_password'
$env:SPRING_FLYWAY_SCHEMAS='petapp'
mvn spring-boot:run
```

If you want the backend to use PostgreSQL instead of the embedded local profile, start the database first with Docker Compose and run the backend with the default profile.

Run frontend locally (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Running tests

Backend (Maven):
```powershell
cd backend
mvn test
```

Frontend (Playwright):
```bash
cd frontend
npm install
npx playwright install
npx playwright test
```

Deploying to Render

- Create two services on Render:
  1) Backend Web Service: set the Dockerfile path to `backend/Dockerfile`, set environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`).
  2) Frontend Static Site or Web Service: either use `frontend/Dockerfile` as a Web Service or configure a Static Site that builds with `npm install && npm run build` and serves `dist/`.

- Ensure the backend's `SPRING_DATASOURCE_URL` points to a Render-managed PostgreSQL instance.

Notes
- Image uploads currently use a local `uploads/` directory (mounted in Docker Compose). For production, enable S3 in `StorageService` and provide AWS credentials; I included the AWS SDK and can add an S3-backed implementation.
- Auth uses JWT tokens returned in responses; to harden for production, use secure HttpOnly cookies and implement refresh token rotation.
