import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from '@common/database/prisma.service';
import { ActionsRegistry } from '@modules/area/actions/actions-registry';
import { ReactionsRegistry } from '@modules/area/reactions/reactions-registry';

@Injectable()
export class EngineService {
  private readonly logger = new Logger(EngineService.name);
  private processing = new Set<number>();

  constructor(
    private prisma: PrismaService,
    private moduleRef: ModuleRef,
  ) {}

  @Cron('* * * * * *')
  async runAreas() {
    const areas = await this.prisma.area.findMany({
      where: { is_active: true },
      include: { action: true, reaction: true },
    });

    for (const area of areas) {
      if (this.processing.has(area.id)) continue;

      this.processing.add(area.id);
      try {
        await this.processArea(area);
        this.logger.log(`Processed area ${area.id}`);
      } catch (err) {
        this.logger.error(`Error processing area ${area.id}`, err);
      } finally {
        this.processing.delete(area.id);
      }
    }
  }

  private async processArea(area: any) {
    const actionKey = `${area.action.service}.${area.action.type}`;
    const ActionHandlerClass = ActionsRegistry[actionKey];
    if (!ActionHandlerClass) return;

    const handler = this.moduleRef.get(ActionHandlerClass, { strict: false });

    const result = await handler.check(
      area.action.parameters,
      area.action.current_state,
      { userId: area.user_id },
    );

    if (result.newState !== undefined) {
      await this.prisma.action.update({
        where: { id: area.action.id },
        data: { current_state: result.newState },
      });
    }

    if (!result.triggered) return;

    const reactionKey = `${area.reaction.service}.${area.reaction.type}`;
    const ReactionHandlerClass = ReactionsRegistry[reactionKey];
    if (!ReactionHandlerClass) return;

    const reactionHandler = this.moduleRef.get(ReactionHandlerClass, {
      strict: false,
    });

    await reactionHandler.execute(area.reaction.parameters, {
      userId: area.user_id,
    });
  }
}
