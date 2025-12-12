export interface ActionHandler {
  name: string;
  description: string;
  check(
    parameters: any,
    currentState: any,
  ): Promise<{
    triggered: boolean;
    newState?: any;
  }>;
}
