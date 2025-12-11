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
    provider_id VARCHAR(255) NOT NULL,
    access_token VARCHAR(4096) NOT NULL,
    refresh_token VARCHAR(4096),
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,

    CONSTRAINT unique_provider UNIQUE (provider, provider_id)
);

CREATE INDEX idx_provideraccount_userId ON "ProviderAccount"(user_id);

CREATE TABLE IF NOT EXISTS "Area" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Action" (
    id SERIAL PRIMARY KEY,
    service VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,

    parameters JSONB,

    current_state JSONB,

    area_id INT NOT NULL UNIQUE REFERENCES "Area"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Reaction" (
    id SERIAL PRIMARY KEY,
    service VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,

    parameters JSONB,

    area_id INT NOT NULL UNIQUE REFERENCES "Area"(id) ON DELETE CASCADE
);

CREATE INDEX idx_area_userid ON "Area"(user_id);
