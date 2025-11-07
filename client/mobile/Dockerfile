FROM node:24-alpine3.22

WORKDIR /app

ARG PORT
ENV PORT=${PORT}

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npx expo start --port $PORT --non-interactive"]
