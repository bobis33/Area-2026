FROM node:25-alpine3.22 AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY ./package.json ./tsconfig.json ./
COPY ./client/web ./client/web
COPY ./packages/ui ./packages/ui

RUN npm i --workspace client/web
RUN npm i --workspace packages/ui && npm --workspace packages/ui run build  && npm cache clean --force

WORKDIR /app/client/web

RUN npm run build && npm cache clean --force

FROM nginx:1.29.3-alpine-slim

WORKDIR /app

COPY --from=builder ./app/client/web/dist /usr/share/nginx/html

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
