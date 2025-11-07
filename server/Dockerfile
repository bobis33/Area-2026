FROM node:24-alpine3.22 AS build

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package.json ./

RUN npm i

COPY . .

RUN npm run prisma:generate && npm run build

FROM node:24-alpine3.22

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client


CMD ["node", "dist/main.js"]
