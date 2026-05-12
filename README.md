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

Run backend locally (without Docker)

```powershell
cd backend
$env:SPRING_DATASOURCE_URL='jdbc:postgresql://127.0.0.1:5432/petstore'
$env:SPRING_DATASOURCE_USERNAME='petstore'
$env:SPRING_DATASOURCE_PASSWORD='dev_password'
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
  1) Backend Web Service: set the Dockerfile path to `backend/Dockerfile`, and set environment variables (`DATABASE_URL`, `APP_CORS_ALLOWED_ORIGINS`). Render will provide `DATABASE_URL` from the Postgres service; the backend entrypoint converts it into Spring's JDBC settings at startup.
  2) Frontend Static Site or Web Service: either use `frontend/Dockerfile` as a Web Service or configure a Static Site that builds with `npm install && npm run build` and serves `dist/`.

- Ensure the backend is linked to the Render-managed PostgreSQL instance via `DATABASE_URL`.

Notes
- Image uploads currently use a local `uploads/` directory (mounted in Docker Compose). For production, enable S3 in `StorageService` and provide AWS credentials; I included the AWS SDK and can add an S3-backed implementation.
- JWT authentication is disabled for this deployment profile. Cart and checkout use `X-User-Id` request header (defaults to `guest` if omitted).
