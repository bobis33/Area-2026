import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from '@common/database/prisma.service';
import { ActionsRegistry } from '@modules/area/actions/actions-registry';
import { ReactionsRegistry } from '@modules/area/reactions/reactions-registry';

@Injectable()
export class EngineService {
  private processing = new Set<number>();
  private readonly logger = new Logger(EngineService.name);

  constructor(
    private prisma: PrismaService,
    private moduleRef: ModuleRef,
  ) {}

  @Cron('* * * * * *')
  async runAreas() {
    try {
      const areas = await this.prisma.area.findMany({
        where: { is_active: true },
        include: { action: true, reaction: true },
      });

      for (const area of areas) {
        if (this.processing.has(area.id)) {
          continue;
        }

        this.processing.add(area.id);
        try {
          await this.processArea(area);
        } catch (err) {
          this.logger.error(`Error processing area ID ${area.id}:`, err);
        } finally {
          this.processing.delete(area.id);
        }
      }
    } catch (err: any) {
      if (err.code !== 'P2037') {
        this.logger.error('Error in runAreas cron:', err);
      }
    }
  }

  private async processArea(area: any) {
    if (!area.action || !area.reaction) {
      return;
    }

    const actionKey = `${area.action.service}.${area.action.type}`;

    const ActionHandlerClass = ActionsRegistry[actionKey];
    if (!ActionHandlerClass) {
      return;
    }

    const handler = this.moduleRef.get(ActionHandlerClass, { strict: false });

    const result = await handler.check(
      area.action.parameters,
      area.action.current_state,
      { userId: area.user_id },
    );

    if (result.newState !== undefined) {
      try {
        await this.prisma.action.update({
          where: { id: area.action.id },
          data: { current_state: result.newState },
        });
      } catch (error: any) {
        // Action not found
        if (error.code === 'P2025') {
          return;
        }
        throw error;
      }
    }

    if (!result.triggered) {
      return;
    }

    const reactionKey = `${area.reaction.service}.${area.reaction.type}`;

    const ReactionHandlerClass = ReactionsRegistry[reactionKey];
    if (!ReactionHandlerClass) {
      return;
    }

    const reactionHandler = this.moduleRef.get(ReactionHandlerClass, {
      strict: false,
    });

    await reactionHandler.execute(area.reaction.parameters, {
      userId: area.user_id,
    });
  }
}
