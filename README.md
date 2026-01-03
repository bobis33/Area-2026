<img src="https://raw.githubusercontent.com/bobis33/Area-2026/main/assets/main_logo.png" width="50" height="50" align="left" alt="Area logo"> 

# EPITECH | Area

[![CI - Build & Test](https://github.com/bobis33/Area-2026/actions/workflows/ci.yml/badge.svg)](https://github.com/bobis33/Area-2026/actions/workflows/ci.yml)
[![CI - CodeQL](https://github.com/bobis33/Area-2026/actions/workflows/codeql.yml/badge.svg)](https://github.com/bobis33/Area-2026/actions/workflows/codeql.yml)
[![CI - Gitleaks](https://github.com/bobis33/Area-2026/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/bobis33/Area-2026/actions/workflows/gitleaks.yml)
[![CD - Mirror](https://github.com/bobis33/Area-2026/actions/workflows/mirror.yml/badge.svg)](https://github.com/bobis33/Area-2026/actions/workflows/mirror.yml)
[![License](https://img.shields.io/github/license/bobis33/Area-2026.svg)](https://github.com/bobis33/Area-2026/blob/main/LICENSE.md)


The **AREA** project is a project that aims to create a platform that allows users to create and manage their own automation scenarios. The platform is composed of three main parts:
- A **backend** that manages the user's data and the automation scenarios.
- A **web frontend** that allows users to create and manage their automation scenarios.
- A **mobile frontend** that allows users to create and manage their automation scenarios.

## Project architecture

![Area diagram](assets/diagram.png)

## Prerequisites

Make sure you have the following dependencies installed on your system:

- [Docker](https://www.docker.com/)
- [Node.js (optional)](https://nodejs.org/)

## Getting started

### With docker

First create a `.env` fil at the root of the repository:
```bash
PROJECT_NAME=area
MODE=development
JWT_SECRET="jwt-secret-key"

API_CONTAINER_PORT=8080
WEB_CONTAINER_PORT=8081
MOBILE_CONTAINER_PORT=8082

API_URL="http://localhost:${API_CONTAINER_PORT}"
FRONTEND_URLS="http://localhost:${WEB_CONTAINER_PORT},http://localhost:${MOBILE_CONTAINER_PORT},http://localhost:${API_CONTAINER_PORT}"

POSTGRES_DB="${PROJECT_NAME}_database"
POSTGRES_USER="${PROJECT_NAME}_postgres-user"
POSTGRES_PASSWORD="${PROJECT_NAME}_postgres-password"
POSTGRES_CONTAINER_PORT=8000
POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${PROJECT_NAME}_postgresql:${POSTGRES_CONTAINER_PORT}/${POSTGRES_DB}"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CLIENT_CALLBACK_URL=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_CLIENT_CALLBACK_URL=""

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_CLIENT_CALLBACK_URL=""
DISCORD_BOT_TOKEN=""

SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
SPOTIFY_CLIENT_CALLBACK_URL=""

GITLAB_CLIENT_ID=""
GITLAB_CLIENT_SECRET=""
GITLAB_CLIENT_CALLBACK_URL=""
```

Build and run docker compose:
```bash
docker compose up
```

> [!IMPORTANT]
> While developing you probably going to change dockerfile image, or build instruction, or whatever ...Sometimes your change will not appear,
> in this case you need to delete old area image/caches and volumes.

### Manually with node

First create a `.env` fil at the root of the repository:
```bash
PROJECT_NAME=area

POSTGRES_DB="${PROJECT_NAME}_database"
POSTGRES_USER="${PROJECT_NAME}_postgres-user"
POSTGRES_PASSWORD="${PROJECT_NAME}_postgres-password"
POSTGRES_CONTAINER_PORT=8000
POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${PROJECT_NAME}_postgresql:${POSTGRES_CONTAINER_PORT}/${POSTGRES_DB}"
```

Change postgres network config in `docker-compose.yml` (internal become false):
```yaml
networks:
  area_network_postgresql:
    name: ${PROJECT_NAME}_network_postgresql
    driver: bridge
    internal: false
```

Run postgresSQL container:
```bash
docker compose up -d area_service_postgresql ## Run only Postgres DB
```

Then install dependencies and generate prisma client:
```bash
npm i ## Install dependencies
npm run server:prisma:generate ## Run migrations
npm run ui:build ## Build UI package
```

Create .env files in each project folder:
#### Server (.env in ./packages/server)
```bash
PROJECT_NAME=area
PORT=8080
JWT_SECRET="jwt-secret-key"

POSTGRES_DB="${PROJECT_NAME}_database"
POSTGRES_USER="${PROJECT_NAME}_postgres-user"
POSTGRES_PASSWORD="${PROJECT_NAME}_postgres-password"
POSTGRES_CONTAINER_PORT=8000
POSTGRES_URL="postgresql://area_postgres-user:area_postgres-password@localhost:8000/area_database"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CLIENT_CALLBACK_URL=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_CLIENT_CALLBACK_URL=""

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_CLIENT_CALLBACK_URL=""
DISCORD_BOT_TOKEN=""

SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
SPOTIFY_CLIENT_CALLBACK_URL=""

GITLAB_CLIENT_ID=""
GITLAB_CLIENT_SECRET=""
GITLAB_CLIENT_CALLBACK_URL=""

FRONTEND_URLS="http://localhost:${WEB_CONTAINER_PORT},http://localhost:${MOBILE_CONTAINER_PORT},http://localhost:${API_CONTAINER_PORT}"
```
#### Web (.env in ./packages/web)
```bash
PORT=8081
API_PORT=8080
API_URL="http://localhost:${API_PORT}"
```
#### Mobile (.env in ./packages/mobile)
```bash
PORT=8082
API_PORT=8080
API_URL="http://localhost:${API_PORT}"
```

Finally, run the project you want:
```bash
npm run server:start ## run server
npm run web:start ## run web frontend
npm run mobile:start ## run mobile frontend
```
> [!INFO]
> For more information look the [package.json](https://github.com/bobis33/Area-2026/blob/main/package.json)

## Documentation

- [Backend](https://github.com/bobis33/Area-2026/blob/main/packages/server/README.md)
- [Front mobile](https://github.com/bobis33/Area-2026/blob/main/packages/mobile/README.md)
- [Front web](https://github.com/bobis33/Area-2026/blob/main/packages/web/README.md)

## Security
Please review our [Security Policy](https://github.com/bobis33/Area-2026/blob/main/SECURITY.md) for more information on reporting security vulnerabilities.


## Contributing
Want to contribute? See [contributing guidelines](https://github.com/bobis33/Area-2026/blob/main/CONTRIBUTING.md).

## License
This project is licensed under the MIT License - see the [License](https://github.com/bobis33/Area-2026/blob/main//LICENSE.md) file for details.
