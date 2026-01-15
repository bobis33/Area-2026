import { Injectable, Type } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { ActionsRegistry } from '@modules/area/actions/actions-registry';
import { ReactionsRegistry } from '@modules/area/reactions/reactions-registry';
import { CreateAreaDto, ActionDto, ReactionDto } from '@dto/area.dto';
import {
  REACTION_METADATA_KEY,
  ACTION_METADATA_KEY,
} from '@decorators/area.decorator';
import { AreaMetadata } from '@interfaces/area.interface';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}

  private getServiceName(fullName: string) {
    return fullName.split('.')[0];
  }

  private extractActions(registry: Record<string, Type<any>>) {
    return Object.entries(registry).map(([key, clazz]) => {
      const meta = Reflect.getMetadata(
        ACTION_METADATA_KEY,
        clazz,
      ) as AreaMetadata;

      return {
        service: this.getServiceName(key),
        name: meta?.name ?? key,
        description: meta?.description ?? '',
      };
    });
  }

  private extractReactions(registry: Record<string, Type<any>>) {
    return Object.entries(registry).map(([key, clazz]) => {
      const meta = Reflect.getMetadata(
        REACTION_METADATA_KEY,
        clazz,
      ) as AreaMetadata;

      return {
        service: this.getServiceName(key),
        name: meta?.name ?? key,
        description: meta?.description ?? '',
      };
    });
  }

  public groupByService() {
    const services: Record<string, any> = {};

    for (const action of this.extractActions(ActionsRegistry)) {
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

    for (const reaction of this.extractReactions(ReactionsRegistry)) {
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

  getAllActions(): ActionDto[] {
    return Object.entries(ActionsRegistry).map(([key, handler]) => {
      const meta = Reflect.getMetadata(ACTION_METADATA_KEY, handler) ?? {};

      return {
        service: key.split('.')[0],
        type: key.split('.')[1],
        oauth: meta.oauth,
        parameters: meta.parameters ?? '',
      };
    });
  }

  getAllReactions(): ReactionDto[] {
    return Object.entries(ReactionsRegistry).map(([key, handler]) => {
      const meta = Reflect.getMetadata(REACTION_METADATA_KEY, handler) ?? {};
      return {
        service: key.split('.')[0],
        type: key.split('.')[1],
        oauth: meta.oauth,
        parameters: meta.parameters ?? '',
      };
    });
  }

  async create(dto: CreateAreaDto) {
    return this.prisma.area.create({
      data: {
        name: dto.name,
        is_active: true,
        user: { connect: { id: dto.userId } },
        action: {
          create: {
            service: dto.action.service,
            type: dto.action.type,
            parameters: dto.action.parameters,
          },
        },
        reaction: {
          create: {
            service: dto.reaction.service,
            type: dto.reaction.type,
            parameters: dto.reaction.parameters,
          },
        },
      },
      include: { action: true, reaction: true },
    });
  }

  async getAll() {
    return this.prisma.area.findMany({
      include: { action: true, reaction: true },
    });
  }

  async getById(id: number) {
    return this.prisma.area.findUnique({
      where: { id },
      include: { action: true, reaction: true },
    });
  }

  async delete(id: number) {
    return this.prisma.area.delete({
      where: { id },
    });
  }

  async activate(id: number, active: boolean) {
    return this.prisma.area.update({
      where: { id: id },
      data: { is_active: active },
    });
  }

  async rename(id: number, newName: string) {
    return this.prisma.area.update({
      where: { id: id },
      data: { name: newName },
    });
  }
}
