export interface ActionHandler {
    check(parameters: any, currentState: any): Promise<{
        name: string;
        description: string;
        triggered: boolean;
        newState?: any;
    }>;
}

