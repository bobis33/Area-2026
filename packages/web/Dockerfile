FROM node:25-alpine3.22 AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY ./package.json ./tsconfig.json ./
COPY ./packages/web ./packages/web
COPY ./packages/ui ./packages/ui

RUN npm i --workspace packages/web
RUN npm i --workspace packages/ui && npm --workspace packages/ui run build  && npm cache clean --force

WORKDIR /app/packages/web

RUN npm run build && npm cache clean --force

FROM nginx:1.29.4-alpine-slim

WORKDIR /app

COPY --from=builder ./app/packages/web/dist /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/html/downloads

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
    \n\
    location / {\n\
        try_files \$uri /index.html;\n\
    }\n\
    \n\
    location /client.apk {\n\
        alias /usr/share/nginx/html/downloads/client.apk;\n\
        add_header Content-Type application/vnd.android.package-archive;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf

VOLUME ["/app/shared"]

CMD ["nginx", "-g", "daemon off;"]
