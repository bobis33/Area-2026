export interface AreaMetadata {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface ActionHandler {
  check(
    parameters: any,
    currentState: any,
  ): Promise<{
    triggered: boolean;
    newState?: any;
  }>;
}

export interface ReactionHandler {
  execute(parameters: any): Promise<void>;
}
