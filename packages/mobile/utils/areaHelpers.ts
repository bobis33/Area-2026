import { AreaActionDefinition, AreaReactionDefinition, ParamField } from '@/types/api';

export type ParamMap = Record<string, ParamField> | string;

/**
 * Type guard to check if a parameter map is an object
 */
export function isParamObject(p: ParamMap): p is Record<string, ParamField> {
  return typeof p === 'object' && p !== null;
}

/**
 * Normalize a value to a trimmed string
 */
const norm = (v: any) => String(v ?? '').trim();

/**
 * Pick the first non-empty string from multiple values
 */
const pickFirstString = (...vals: any[]): string => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return '';
};

/**
 * Extract service name from various formats
 */
export const extractService = (svc: any): string => {
  if (typeof svc === 'string') return svc.trim();
  if (svc && typeof svc === 'object') {
    return pickFirstString(svc.service, svc.name, svc.key, svc.slug, svc.id);
  }
  return '';
};

/**
 * Extract type name from various formats
 */
export const extractType = (t: any): string => {
  if (typeof t === 'string') return t.trim();
  if (t && typeof t === 'object') {
    return pickFirstString(t.type, t.name, t.key, t.slug, t.id);
  }
  return '';
};

/**
 * Safely extract service name with fallback
 */
export const safeService = (v: any): string => extractService(v) || 'unknown';

/**
 * Safely extract type name with fallback
 */
export const safeType = (v: any): string => extractType(v) || 'unknown';

/**
 * Create a unique key from service and type
 */
export const makeKey = (service: any, type: any): string =>
  `${safeService(service)}.${safeType(type)}`;

/**
 * Group actions by service
 * Note: "time" actions are kept with their original service but displayed under "discord"
 */
export const groupActionsByService = (
  actions: AreaActionDefinition[],
): Record<string, AreaActionDefinition[]> => {
  const grouped: Record<string, AreaActionDefinition[]> = {};
  actions.forEach(action => {
    const svc = safeService(action.service);
    // Keep original service in the action object
    if (!grouped[svc]) {
      grouped[svc] = [];
    }
    grouped[svc].push({
      ...action,
      service: svc, // Keep original service (time stays as time)
      type: safeType(action.type),
    });
  });
  return grouped;
};

/**
 * Group reactions by service
 */
export const groupReactionsByService = (
  reactions: AreaReactionDefinition[],
): Record<string, AreaReactionDefinition[]> => {
  const grouped: Record<string, AreaReactionDefinition[]> = {};
  reactions.forEach(reaction => {
    const svc = safeService(reaction.service);
    if (!grouped[svc]) {
      grouped[svc] = [];
    }
    grouped[svc].push({
      ...reaction,
      service: svc,
      type: safeType(reaction.type),
    });
  });
  return grouped;
};

/**
 * Get all unique services from actions and reactions
 */
export const getAllServices = (
  actionsByService: Record<string, AreaActionDefinition[]>,
  reactionsByService: Record<string, AreaReactionDefinition[]>,
): string[] => {
  const actionServices = new Set(Object.keys(actionsByService));
  const reactionServices = new Set(Object.keys(reactionsByService));
  return Array.from(new Set([...actionServices, ...reactionServices])).sort();
};

/**
 * Validate parameters against their definition
 */
export const validateParams = (
  paramsDef: ParamMap | undefined,
  values: Record<string, any>,
): boolean => {
  if (!paramsDef || typeof paramsDef === 'string' || !isParamObject(paramsDef)) {
    return true;
  }

  for (const [key, field] of Object.entries(paramsDef)) {
    if (field.optional !== true && (values[key] === undefined || values[key] === '')) {
      return false;
    }
  }
  return true;
};

export const getServiceBrandColors = (service: string): { 
  backgroundColor: string; 
  borderColor: string;
  iconColor: string;
} => {
  const serviceLower = service.toLowerCase();
  
  switch (serviceLower) {
    case 'discord':
      return {
        backgroundColor: '#5865F2', 
        borderColor: '#5865F2',
        iconColor: '#FFFFFF',
      };
    case 'spotify':
      return {
        backgroundColor: '#1DB954', 
        borderColor: '#1DB954',
        iconColor: '#FFFFFF',
      };
    case 'gitlab':
      return {
        backgroundColor: '#FC6D26', 
        borderColor: '#FC6D26',
        iconColor: '#FFFFFF',
      };
    case 'github':
      return {
        backgroundColor: '#18181B', 
        borderColor: '#18181B',
        iconColor: '#FFFFFF',
      };
    case 'google':
      return {
        backgroundColor: '#FFFFFF', 
        borderColor: '#E2E2E3',
        iconColor: '#222120', 
      };
    default:
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        iconColor: 'transparent',
      };
  }
};


