FROM node:25-alpine3.22

WORKDIR /app

ARG PORT
ENV PORT=${PORT}

COPY package.json tsconfig.json ./
COPY packages/ui ./packages/ui
COPY ./client/mobile ./client/mobile

RUN npm i --workspace client/mobile
RUN npm i --workspace packages/ui && npm --workspace packages/ui run build  && npm cache clean --force

WORKDIR /app/client/mobile

CMD ["sh", "-c", "npx expo start --port $PORT --non-interactive"]
