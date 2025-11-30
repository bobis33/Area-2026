# EPITECH | Area

The **AREA** project is a project that aims to create a platform that allows users to create and manage their own automation scenarios. The platform is composed of three main parts:
- A **backend** that manages the user's data and the automation scenarios.
- A **web frontend** that allows users to create and manage their automation scenarios.
- A **mobile frontend** that allows users to create and manage their automation scenarios.

## Project architecture

[![](https://mermaid.ink/img/pako:eNqdVG1vmzAQ_iuW-2WTSASkBLDWSl0jbZX6kjaRJo1MkwOX4BUwsk3bLMl_n4E0L4NMXS1bPt89fu58PnuJQx4BJniW8OcwpkKh64dJhnSTxXQuaB6jCda91h3oLxMGmdoZDow3fMoSCOrpxyGobAJoqH5mVLFZ8FDK6FbLT9BEjhc5jELBcvUXDWTREeffYBro0eK2ctX9JYNX4b3-qkVLUkYgnkAcietieBXo0RLXLcgqrM3cBOSCyZS2Ryv_LzuDz02aIZdqLmB0fx182Mkf38xZHpuFIINXoeWMAyZDLqKm4QtTCZ226uOiTc_5PGmplKtMKqrjSd9-b3V9ok9nZ-err-PxcLQqL2ln11V03KgXqNM5X-lMofsCBAO52stkE3h3Uah4tU1WDdiLSKqFDmbHgGYsSchJr9d3fcuQSvBHICemaW7kzjOLVEzs_GV_f_0u0QYSUamftaALghzkbEkcx_knSV3H7yDBBp4LFmEyo4kEA6cgUlqu8bLkn2AVQwoTTLQYUfFYfi1rvSmn2XfOU0yUKPQ2wYt5vCUp8ogqGLDqdrdaoVMH4pIXmcLE8voVCSZL_IKJbfW7tm07fc-xbM9yfQMvNMi3up5n2a7nu-ap5_ju2sC_K7dmt--6ruedWo7lmr7t9AwMEVNc3NQ_ZPVRrv8ApN901g?type=png)](https://mermaid.live/edit#pako:eNqdVG1vmzAQ_iuW-2WTSASkBLDWSl0jbZX6kjaRJo1MkwOX4BUwsk3bLMl_n4E0L4NMXS1bPt89fu58PnuJQx4BJniW8OcwpkKh64dJhnSTxXQuaB6jCda91h3oLxMGmdoZDow3fMoSCOrpxyGobAJoqH5mVLFZ8FDK6FbLT9BEjhc5jELBcvUXDWTREeffYBro0eK2ctX9JYNX4b3-qkVLUkYgnkAcietieBXo0RLXLcgqrM3cBOSCyZS2Ryv_LzuDz02aIZdqLmB0fx182Mkf38xZHpuFIINXoeWMAyZDLqKm4QtTCZ226uOiTc_5PGmplKtMKqrjSd9-b3V9ok9nZ-err-PxcLQqL2ln11V03KgXqNM5X-lMofsCBAO52stkE3h3Uah4tU1WDdiLSKqFDmbHgGYsSchJr9d3fcuQSvBHICemaW7kzjOLVEzs_GV_f_0u0QYSUamftaALghzkbEkcx_knSV3H7yDBBp4LFmEyo4kEA6cgUlqu8bLkn2AVQwoTTLQYUfFYfi1rvSmn2XfOU0yUKPQ2wYt5vCUp8ogqGLDqdrdaoVMH4pIXmcLE8voVCSZL_IKJbfW7tm07fc-xbM9yfQMvNMi3up5n2a7nu-ap5_ju2sC_K7dmt--6ruedWo7lmr7t9AwMEVNc3NQ_ZPVRrv8ApN901g)

## Prerequisites

Make sure you have the following dependencies installed on your system:

- [Docker](https://www.docker.com/)
- [Node.js (optional)](https://nodejs.org/)

## Getting started

First create a `.env` fil at the root of the repository:
```bash
VERSION=0.0.0
PROJECT_NAME=area
MODE=development

API_CONTAINER_PORT=8080
WEB_CONTAINER_PORT=8081
MOBILE_CONTAINER_PORT=8082

API_URL="http://localhost:${API_CONTAINER_PORT}"
FRONTEND_URLS="http://localhost:${WEB_CONTAINER_PORT},http://localhost:${MOBILE_CONTAINER_PORT}"

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

JWT_SECRET="jwt-secret-key"
```
### With docker

Build and run docker compose:
```bash
docker compose up
```

> [!IMPORTANT]
> While developing you probably going to change dockerfile image, or build instruction, or whatever ...Sometimes your change will not appear,
> in this case you need to delete old area image/caches and volumes.

### Manually with node

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
npm run packages:ui:build ## Build UI package
```

Create .env files in each project folder:
#### Server (.env in /server)
```bash
PROJECT_NAME=area
PORT=8080
POSTGRES_DB="${PROJECT_NAME}_database"
POSTGRES_USER="${PROJECT_NAME}_postgres-user"
POSTGRES_PASSWORD="${PROJECT_NAME}_postgres-password"
POSTGRES_CONTAINER_PORT=8000
POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_CONTAINER_PORT}/${POSTGRES_DB}"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_CALLBACK_URL=
JWT_SECRET="jwt-secret-key"
FRONTEND_URLS="http://localhost:${WEB_CONTAINER_PORT},http://localhost:${MOBILE_CONTAINER_PORT}"
```
#### Web (.env in /client/web)
```bash
PORT=8081
API_PORT=8080
API_URL="http://localhost:${API_PORT}/api"
```
#### Mobile (.env in /client/mobile)
```bash
PORT=8082
API_PORT=8080
API_URL="http://localhost:${API_PORT}/api"
```

Finally, run the project you want:
```bash
npm run server:start ## run server
npm run web:start ## run web frontend
npm run mobile:start ## run mobile frontend
```

For more information look the [package.json](https://github.com/bobis33/Area-2026/blob/main/package.json)

## Documentation

- [Backend](https://github.com/bobis33/Area-2026/blob/main/server/README.md)
- [Front mobile](https://github.com/bobis33/Area-2026/blob/main/client/mobile/README.md)
- [Front web](https://github.com/bobis33/Area-2026/blob/main/client/web/README.md)

## Contributing
➡️ Want to contribute? See [contributing guidelines](https://github.com/bobis33/Area-2026/blob/main/CONTRIBUTING.md).
