# Action-Reaction Workflow Documentation

## Overview

This document explains how the Action-Reaction automation system works in the AREA project, detailing the communication between the backend and frontend web client.

## Architecture

### Backend Components

#### 1. **Actions Registry** (`server/src/modules/area/actions/actions-registry.ts`)
- Central registry of all available actions (triggers)
- Maps action keys to their handler classes
- Example: `'time.cron': TimeCronAction`

#### 2. **Reactions Registry** (`server/src/modules/area/reactions/reactions-registry.ts`)
- Central registry of all available reactions (responses)
- Maps reaction keys to their handler classes
- Example: `'discord.send_message_channel': DiscordSendMessageChannelReaction`

#### 3. **Action Handlers**
Located in `server/src/modules/area/actions/`

Each action handler implements:
```typescript
interface ActionHandler {
  check(params: any, state: any): Promise<{
    triggered: boolean;
    newState?: any;
  }>;
}
```

**Example: Time Cron Action**
```typescript
@Action({
  parameters: {
    cron: {
      type: 'string',
      description: 'The cron expression to evaluate',
      example: '*/5 * * * *',
    },
    timezone: {
      type: 'string',
      description: 'The timezone to use',
      example: 'Europe/Paris',
      optional: true,
    },
  },
})
class TimeCronAction implements ActionHandler {
  async check(params: { cron: string; timezone?: string }, state: any) {
    // Check if cron expression matches current time
    // Returns { triggered: true/false, newState: {...} }
  }
}
```

#### 4. **Reaction Handlers**
Located in `server/src/modules/area/reactions/`

Each reaction handler implements:
```typescript
interface ReactionHandler {
  execute(params: any): Promise<void>;
}
```

**Example: Discord Send Message**
```typescript
@Reaction({
  parameters: {
    channelId: {
      type: 'string',
      description: 'The ID of the Discord channel',
      example: '123456789012345678',
    },
    message: {
      type: 'string',
      description: 'The message to send',
      example: 'Hello, world!',
    },
  },
})
class DiscordSendMessageChannelReaction implements ReactionHandler {
  async execute(params: { channelId: string; message: string }) {
    // Send message to Discord channel
  }
}
```

#### 5. **Engine Service** (`server/src/modules/area/engine.service.ts`)
- Runs every second via `@Cron('* * * * * *')`
- Fetches all active areas from database
- For each area:
  1. Gets the action handler
  2. Calls `check()` to see if action is triggered
  3. Updates action state in database
  4. If triggered, gets the reaction handler
  5. Calls `execute()` to perform the reaction

#### 6. **Area Controller** (`server/src/modules/area/area.controller.ts`)
Provides REST API endpoints:
- `GET /areas/actions` - List available actions
- `GET /areas/reactions` - List available reactions
- `POST /areas` - Create new automation
- `GET /areas` - Get all user's automations
- `GET /areas/:id` - Get specific automation
- `DELETE /areas/:id` - Delete automation

### Frontend Web Components

#### 1. **Area Page** (`client/web/src/pages/Area/Area.tsx`)

**Data Flow:**

1. **Load Available Actions/Reactions**
```typescript
const [areasData, actionsData, reactionsData] = await Promise.all([
  get<Area[]>("/areas", token),
  get<ActionDefinition[]>("/areas/actions", token),
  get<ReactionDefinition[]>("/areas/reactions", token),
]);
```

2. **Display Form**
- User selects an action (e.g., `time.cron`)
- Frontend dynamically renders input fields based on action's parameters
- User selects a reaction (e.g., `discord.send_message_channel`)
- Frontend dynamically renders input fields based on reaction's parameters

3. **Create Automation**
```typescript
await post("/areas", {
  name: "My Automation",
  userId: user.id,
  action: {
    service: "time",
    type: "cron",
    parameters: { cron: "*/1 * * * *", timezone: "Europe/Paris" }
  },
  reaction: {
    service: "discord",
    type: "send_message_channel",
    parameters: { channelId: "123...", message: "Hello!" }
  }
}, token);
```

## Complete Workflow Example

### Creating a Discord Notification Automation

1. **User creates automation via frontend:**
   - Name: "Daily Discord Notification"
   - Action: `time.cron`
     - cron: `*/1 * * * *` (every minute)
     - timezone: `Europe/Paris`
   - Reaction: `discord.send_message_channel`
     - channelId: `1440000686414079753`
     - message: "Hello from AREA!"

2. **Frontend sends POST request to `/areas`**

3. **Backend creates database records:**
   - Creates `Area` entry with name and active status
   - Creates `Action` entry with service, type, and parameters
   - Creates `Reaction` entry with service, type, and parameters

4. **Engine executes (every second):**
   ```
   ┌─────────────────────────────────────┐
   │  Engine Service (runs every 1s)    │
   └────────────┬────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────┐
   │  Fetch all active Areas             │
   └────────────┬────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────┐
   │  For each Area:                     │
   │  1. Get Action Handler              │
   │  2. Call check(params, state)       │
   └────────────┬────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────┐
   │  Is triggered?                      │
   └────┬─────────────────┬──────────────┘
        │ No              │ Yes
        ▼                 ▼
   ┌─────────┐   ┌─────────────────────┐
   │  Skip   │   │  Get Reaction      │
   └─────────┘   │  Handler           │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Call execute()     │
                 │  (Send Discord msg) │
                 └─────────────────────┘
   ```

5. **Cron Action checks if it's time to trigger:**
   - Parses cron expression `*/1 * * * *`
   - Compares with current time
   - If match → returns `{ triggered: true }`
   - Updates state with last execution time

6. **Discord Reaction executes:**
   - Fetches Discord channel by ID
   - Sends message to channel
   - Logs success

## Database Schema

```sql
-- Area (automation)
CREATE TABLE Area (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255),
  is_active      BOOLEAN DEFAULT true,
  user_id        INT,
  created_at     TIMESTAMP,
  updated_at     TIMESTAMP
);

-- Action (trigger)
CREATE TABLE Action (
  id             SERIAL PRIMARY KEY,
  service        VARCHAR(255),      -- e.g., "time"
  type           VARCHAR(255),      -- e.g., "cron"
  parameters     JSON,              -- e.g., {"cron": "*/1 * * * *"}
  current_state  JSON,              -- e.g., {"lastExecution": "2025-..."}
  area_id        INT UNIQUE
);

-- Reaction (response)
CREATE TABLE Reaction (
  id             SERIAL PRIMARY KEY,
  service        VARCHAR(255),      -- e.g., "discord"
  type           VARCHAR(255),      -- e.g., "send_message_channel"
  parameters     JSON,              -- e.g., {"channelId": "...", "message": "..."}
  area_id        INT UNIQUE
);
```

## Adding New Actions/Reactions

### 1. Create Action Handler

```typescript
// server/src/modules/area/actions/github/push.ts
@Action({
  parameters: {
    repository: {
      type: 'string',
      description: 'GitHub repository name',
      example: 'user/repo',
    },
  },
})
@Injectable()
export class GitHubPushAction implements ActionHandler {
  async check(params: { repository: string }, state: any) {
    // Check GitHub API for new pushes
    // Return { triggered: true/false, newState: {...} }
  }
}
```

### 2. Register in Actions Registry

```typescript
// server/src/modules/area/actions/actions-registry.ts
export const ActionsRegistry = {
  'time.cron': TimeCronAction,
  'github.push': GitHubPushAction, // Add new action
};
```

### 3. Frontend Automatically Discovers It

The frontend will automatically:
- Fetch the new action via `GET /areas/actions`
- Display it in the dropdown
- Render input fields based on parameters definition
- No frontend code changes needed!

## Authentication

- Frontend stores JWT token in `localStorage`
- Token is sent in `Authorization: Bearer <token>` header
- Backend validates token using JWT strategy
- Area operations are user-scoped (user can only see/manage their own areas)

## Testing

**Example: Test Discord Message**

1. Create automation:
   - Action: `time.cron` with `*/1 * * * *`
   - Reaction: `discord.send_message_channel`
   - channelId: Your Discord channel ID
   - message: "Test from AREA!"

2. Wait up to 1 minute

3. Check Discord channel for message

4. Check backend logs:
```bash
docker logs area_server -f
```

You should see:
```
[EngineService] Processed area X
Message: 'Test from AREA!' sent to channel ...
```

## Troubleshooting

### Automation not triggering
- Check `is_active` is `true` in database
- Verify cron expression is valid
- Check backend logs for errors
- Ensure Engine Service is running (`@Cron` decorator)

### Parameters empty
- Check browser console for sent data
- Verify parameters are objects, not JSON strings
- Check database to see if parameters were saved

### Discord message not sent
- Verify bot token is configured in `.env`
- Check bot has permissions in Discord channel
- Verify channel ID is correct (enable Discord Developer Mode)
- Check bot is in the server

## API Examples

### Get Available Actions
```bash
curl http://localhost:8080/areas/actions
```

Response:
```json
[
  {
    "service": "time",
    "type": "cron",
    "parameters": {
      "cron": {
        "type": "string",
        "description": "The cron expression",
        "example": "*/5 * * * *"
      },
      "timezone": {
        "type": "string",
        "description": "Timezone",
        "example": "Europe/Paris",
        "optional": true
      }
    }
  }
]
```

### Create Area
```bash
curl -X POST http://localhost:8080/areas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Automation",
    "userId": 1,
    "action": {
      "service": "time",
      "type": "cron",
      "parameters": {
        "cron": "*/1 * * * *"
      }
    },
    "reaction": {
      "service": "discord",
      "type": "send_message_channel",
      "parameters": {
        "channelId": "123456789",
        "message": "Hello!"
      }
    }
  }'
```

## Conclusion

The Action-Reaction system is:
- **Extensible**: Easy to add new actions/reactions
- **Automatic**: Frontend discovers new actions/reactions without code changes
- **Type-safe**: Strong typing with TypeScript and DTOs
- **Real-time**: Engine runs every second to check triggers
- **User-friendly**: Dynamic forms based on parameter definitions
