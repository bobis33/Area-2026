import 'reflect-metadata';

export const ACTION_METADATA_KEY = 'action:meta';
export const REACTION_METADATA_KEY = 'reaction:meta';

export function Action(meta: {
  parameters: Record<string, any>;
  name: string;
  description: string;
}) {
  return (target: Function) => {
    Reflect.defineMetadata(ACTION_METADATA_KEY, meta, target);
  };
}

export function Reaction(meta: {
  parameters: Record<string, any>;
  name: string;
  description: string;
}) {
  return (target: Function) => {
    Reflect.defineMetadata(REACTION_METADATA_KEY, meta, target);
  };
}
