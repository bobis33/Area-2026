FROM node:25-alpine3.22

WORKDIR /app

ARG PORT
ENV PORT=${PORT}

COPY mobile/package.json ./
RUN npm install

COPY ./mobile .
COPY ./shared/ui ./app/shared/ui

CMD ["sh", "-c", "npx expo start --port $PORT --non-interactive"]
