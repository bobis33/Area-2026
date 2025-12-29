import 'reflect-metadata';
import { AreaMetadata } from '@interfaces/area.interface';

export const ACTION_METADATA_KEY = 'action:meta';
export const REACTION_METADATA_KEY = 'reaction:meta';

export const Action =
  (metadata: AreaMetadata): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(ACTION_METADATA_KEY, metadata, target);
  };

export const Reaction =
  (metadata: AreaMetadata): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(REACTION_METADATA_KEY, metadata, target);
  };
