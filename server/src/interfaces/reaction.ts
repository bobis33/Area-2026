export interface ReactionHandler {
  execute(parameters: any): Promise<void>;
}
