FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm i
COPY . .

RUN npm run build
RUN npm cache clean --force

FROM nginx:1.29.3-alpine-slim

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}

RUN printf "server {\n\
    listen ${PORT};\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri /index.html;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf


CMD ["nginx", "-g", "daemon off;"]
