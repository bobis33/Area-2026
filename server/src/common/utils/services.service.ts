import { Type } from "@nestjs/common";
import { ACTION_METADATA_KEY, REACTION_METADATA_KEY } from "@decorators/area.decorator";
import { AreaMetadata } from "@interfaces/area.interface";

function getServiceName(fullName: string) {
    return fullName.split('.')[0];
}

export function extractActions(registry: Record<string, Type<any>>) {
    return Object.entries(registry).map(([key, clazz]) => {
        const meta = Reflect.getMetadata(ACTION_METADATA_KEY, clazz) as AreaMetadata;

        return {
            service: getServiceName(key),
            name: meta?.name ?? key,
            description: meta?.description ?? '',
        };
    });
}

export function extractReactions(registry: Record<string, Type<any>>) {
    return Object.entries(registry).map(([key, clazz]) => {
        const meta = Reflect.getMetadata(REACTION_METADATA_KEY, clazz) as AreaMetadata;

        return {
            service: getServiceName(key),
            name: meta?.name ?? key,
            description: meta?.description ?? '',
        };
    });
}

export function groupByService(
    actions: any[],
    reactions: any[],
) {
    const services: Record<string, any> = {};

    for (const action of actions) {
        services[action.service] ??= {
            name: action.service,
            actions: [],
            reactions: [],
        };
        services[action.service].actions.push({
            name: action.name,
            description: action.description,
        });
    }

    for (const reaction of reactions) {
        services[reaction.service] ??= {
            name: reaction.service,
            actions: [],
            reactions: [],
        };
        services[reaction.service].reactions.push({
            name: reaction.name,
            description: reaction.description,
        });
    }

    return Object.values(services);
}