INSERT INTO "User" (name, email, password, role)
VALUES
    ('Alice', 'alice@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('Bob', 'bob@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('Charlie', 'charlie@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('David', 'david@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER'),
    ('Eve', 'eve@example.com', '$2b$10$1HR4vKXvBXlXwA5DmRIFg.lkppvyw6yOxMcay15t7.N84ePXgjUE2', 'USER');

INSERT INTO "ProviderAccount" (provider, provider_id, user_id, access_token, refresh_token)
VALUES
    ('google', 'google-alice-123', 1, 'empty', 'empty'),
    ('discord', 'discord-alice-123', 1, 'empty', 'empty'),
    ('google', 'google-bob-456', 2, 'empty', 'empty'),
    ('discord', 'discord-bob-456', 2, 'empty', 'empty'),
    ('github', 'gh-charlie-789', 3, 'empty', 'empty'),
    ('discord', 'discord-charlie-456', 3, 'empty', 'empty');

INSERT INTO "Area" (name, is_active, user_id)
VALUES ('Test Discord AREA', true, 1);

INSERT INTO "Action" (service, type, parameters, area_id)
VALUES ('time', 'cron', '{ "cron": "*/10 * * * * *", "timezone": "Europe/Paris" }', 1);

INSERT INTO "Reaction" (service, type, parameters, area_id)
VALUES ('discord', 'send_message_channel', '{ "channelId":"1439986928211722324", "message":"Hello, AREA triggered!" }', 1);
