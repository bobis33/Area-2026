export interface ActionHandler {
  check(
    parameters: any,
    currentState: any,
  ): Promise<{
    triggered: boolean;
    newState?: any;
  }>;
}
