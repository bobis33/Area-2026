# Server

## Add new Actions / Reactions

This project uses a **registry-based architecture** to dynamically execute Actions and Reactions.
To add a new Action or Reaction, you must follow a strict convention so that the Engine can resolve and execute it correctly.

---

### 1. Add a new Action

#### 1.1 Create the Action class

Actions must implement the `ActionHandler` interface.

```ts
import { Injectable } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area';

@Injectable()
export class MyCustomAction implements ActionHandler {
  name = 'my.custom_action';
  description = 'Description of what this action does';

  async check(
    params: any,
    state: any,
  ): Promise<{
    triggered: boolean;
    newState?: any;
  }> {
    // Your logic here
    return {
      triggered: true,
      newState: {},
    };
  }
}
```
#### 1.2 Register the Action

Register the Action using the following format:
```ts
<service>.<type>
```
```ts
import { MyCustomAction } from './my-custom-action';

export const ActionsRegistry = {
  'my.custom_action': MyCustomAction,
};
```

#### 1.3. Declare the provider

```ts
providers: [
MyCustomAction,
]
```

### 2. Add a new Reaction

#### 2.1 Create the Reaction class

Reactions must implement the `ReactionHandler` interface.

```ts
import { Injectable } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area';

@Injectable()
export class MyCustomReaction implements ReactionHandler {
  name = 'my.custom_reaction';
  description = 'Description of the reaction';

  async execute(params: any): Promise<void> {
    // Reaction logic
  }
}
```

#### 2.2 Register the Reaction

Register the Reaction using the following format:
```ts
<service>.<type>
```
```ts
import { MyCustomReaction } from './my-custom-reaction';
export const ReactionsRegistry = {
  'my.custom_reaction': MyCustomReaction,
};
```

#### 2.3. Declare the provider

```ts
providers: [
MyCustomReaction,
]
```
