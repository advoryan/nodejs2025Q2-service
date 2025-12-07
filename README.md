git clone {repository URL}
# Home Library Service

NestJS REST API for managing users, artists, albums, tracks, and favorites. The service now uses PostgreSQL + Prisma and ships with a production-ready Docker setup.

## Prerequisites

- [Node.js 24.10.0+](https://nodejs.org/en/download/) (required by the automated tests)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for local PostgreSQL + containerized builds)

## Environment configuration

1. Copy `.env.example` to `.env` and adjust the secrets / DB credentials if needed.
2. Update `DATABASE_URL` to point at the database you plan to use locally (defaults to `localhost:5432`).
3. `DATABASE_URL_DOCKER` is used inside containers and already points at the `db` service exposed by `docker-compose.yml`.

The server listens on the port defined in `.env` (`PORT=4000` by default).

## Local development workflow

```bash

cd nodejs2025Q2-service
npm install
cp .env.example .env # skip if you already personalized the file
npm run prisma:generate
docker compose up -d db   # spins up PostgreSQL with the schema extensions
npm run db:migrate        # applies SQL migrations from prisma/migrations
npm start                 # or npm run start:dev for watch mode
```

Once the API is running you can exercise it with any REST client. A quick endpoint reference:

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/user`             | List users                   |
| POST   | `/user`             | Create user                  |
| PUT    | `/user/{id}`        | Update user password         |
| DELETE | `/user/{id}`        | Delete user                  |
| GET    | `/artist`           | List artists                 |
| GET    | `/album`            | List albums                  |
| GET    | `/track`            | List tracks                  |
| GET    | `/favs`             | List favorites               |
| POST   | `/favs/{type}/{id}` | Add entity to favorites      |
| DELETE | `/favs/{type}/{id}` | Remove entity from favorites |

`doc/api.yaml` contains the complete OpenAPI contract that you can import into Swagger UI / Postman / Insomnia.

## Prisma & database commands

```bash
npm run prisma:generate  # regenerate the Prisma client after schema changes
npm run db:migrate       # run SQL migrations against the current DATABASE_URL
npm run db:push          # sync the schema without migrations (dev only)
npm run db:studio        # open Prisma Studio to inspect data
```

## Docker workflow

All Docker assets live at the repo root:

```bash
# Build images
docker build -t <your-dockerhub>/home-library-api:latest .
docker build -t <your-dockerhub>/home-library-db:latest -f docker/db/Dockerfile .

# Multi-container dev/prod environment
docker compose up -d --build       # build both images and start them
docker compose logs -f api         # follow application logs
docker compose down -v             # stop and clean up volumes

# Scan images for CVEs (Docker Scout)
docker scout quickview <your-dockerhub>/home-library-api:latest
docker scout quickview <your-dockerhub>/home-library-db:latest

# Push images to Docker Hub
docker push <your-dockerhub>/home-library-api:latest
docker push <your-dockerhub>/home-library-db:latest
```

The Compose stack creates a dedicated bridge network so the API can reach PostgreSQL via the `db` hostname. Secrets are injected from `.env`, while the container-only `DATABASE_URL_DOCKER` points at `db:5432`.

## Testing

Make sure PostgreSQL is running (either via `docker compose up db` or your own instance) and migrations are applied before launching the tests.

```bash
# All e2e suites without auth
npm test

# A single suite
npm test -- test/users.e2e.spec.ts

# Auth-required suites
npm run test:auth
npm run test:auth -- test/auth/users.e2e.spec.ts

# Token refresh flow
npm run test:refresh
```

## Tooling

```bash
npm run lint     # ESLint autofix
npm run format   # Prettier
```

### Debugging in VS Code

Use the built-in launch configuration (`F5`) or run the server with `npm run start:debug`.
