export interface ReactionHandler {
  name: string;
  description: string;
  execute(parameters: any): Promise<void>;
}
