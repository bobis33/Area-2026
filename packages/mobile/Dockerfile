FROM node:25-slim AS node-deps

WORKDIR /app

COPY ./package.json ./
COPY ./packages/mobile/package.json ./packages/mobile/package.json
COPY ./packages/ui/package.json ./packages/ui/package.json

RUN npm i --workspace packages/mobile && npm i --workspace packages/ui

FROM node:25-slim AS expo-prebuild

WORKDIR /app

COPY --from=node-deps /app/node_modules ./node_modules

COPY ./packages/mobile ./packages/mobile
COPY ./packages/ui ./packages/ui

WORKDIR /app/packages/mobile

RUN npx expo prebuild --platform android --non-interactive

FROM node:25-slim AS android-build

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
RUN sdkmanager \
    "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0"

WORKDIR /app

COPY --from=expo-prebuild /app /app

WORKDIR /app/packages/mobile/android
RUN chmod +x ./gradlew && ./gradlew assembleRelease --stacktrace


FROM debian:13-slim AS artifact

WORKDIR /output

COPY --from=android-build \
  /app/packages/mobile/android/app/build/outputs/apk/release/*.apk \
  ./client.apk
