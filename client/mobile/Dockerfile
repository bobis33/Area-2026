FROM node:25-alpine3.22

WORKDIR /app

ARG PORT
ENV PORT=${PORT}

COPY ./package.json ./tsconfig.json ./
COPY ./client/mobile/package.json ./client/mobile/package.json
COPY ./packages/ui/package.json ./packages/ui/package.json

RUN npm i --workspace client/mobile && npm i --workspace packages/ui

COPY ./client/mobile ./client/mobile
COPY ./packages/ui ./packages/ui

EXPOSE ${PORT}

WORKDIR /app/client/mobile

CMD ["sh", "-c", "npx expo start --port $PORT --non-interactive"]
