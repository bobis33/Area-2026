import { Injectable, BadRequestException } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Reaction({
  parameters: {},
  name: 'spotify.skip_next',
  description: 'Skips to the next track on Spotify',
})
@Injectable()
export class SpotifySkipNextReaction implements ReactionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async execute(_params: object, context?: { userId: number }): Promise<void> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.spotifyService.nextTrack(context.userId);
  }
}
