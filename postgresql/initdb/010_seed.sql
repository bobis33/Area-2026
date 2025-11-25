INSERT INTO "User" (name, email, password, role)
VALUES
    ('Alice', 'alice@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('Bob', 'bob@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('Charlie', 'charlie@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('David', 'david@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('Eve', 'eve@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER');

INSERT INTO "ProviderAccount" (provider, providerId, userId)
VALUES
    ('google', 'google-alice-123', 1),
    ('discord', 'discord-alice-123', 1),
    ('google', 'google-bob-456', 2),
    ('discord', 'discord-bob-456', 2),
    ('github', 'gh-charlie-789', 3),
    ('discord', 'discord-charlie-456', 3);
