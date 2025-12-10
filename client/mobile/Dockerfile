FROM node:20-slim

RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    unzip \
    wget \
    git \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools/latest \
    && cd ${ANDROID_HOME}/cmdline-tools/latest \
    && wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O tools.zip \
    && unzip tools.zip \
    && rm tools.zip \
    && mv cmdline-tools/* . \
    && rm -rf cmdline-tools

RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

WORKDIR /app

COPY ./package.json ./tsconfig.json ./
COPY ./client/mobile/package.json ./client/mobile/package.json
COPY ./packages/ui/package.json ./packages/ui/package.json

RUN npm i --workspace client/mobile && npm i --workspace packages/ui

COPY ./client/mobile ./client/mobile
COPY ./packages/ui ./packages/ui

WORKDIR /app/client/mobile

RUN npx expo prebuild --platform android --non-interactive

WORKDIR /app/client/mobile/android

RUN chmod +x ./gradlew && ./gradlew assembleRelease
