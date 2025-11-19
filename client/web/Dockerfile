FROM node:25-alpine3.22 AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json ./
RUN npm i
COPY ./web .
COPY ./shared/ui ./src/shared/ui

RUN npm run build
RUN npm cache clean --force

FROM nginx:1.29.3-alpine-slim

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html

ARG VITE_PORT
ARG VITE_API_URL
ENV VITE_PORT=${VITE_PORT}
ENV VITE_API_URL=${VITE_API_URL}

EXPOSE ${VITE_PORT}

RUN printf "server {\n\
    listen ${VITE_PORT};\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri /index.html;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf


CMD ["nginx", "-g", "daemon off;"]
