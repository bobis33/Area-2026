CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS "ProviderAccount" (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(255) NOT NULL,
    providerId VARCHAR(255) NOT NULL,
    userId INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,

    CONSTRAINT unique_provider UNIQUE (provider, providerId)
    );

CREATE INDEX idx_provideraccount_userId ON "ProviderAccount"(userId);
