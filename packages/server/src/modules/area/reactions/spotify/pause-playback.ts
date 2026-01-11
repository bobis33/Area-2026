import { Injectable, BadRequestException } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Reaction({
  parameters: {},
  name: 'spotify.pause_playback',
  description: 'Pauses the current playback on Spotify',
})
@Injectable()
export class SpotifyPausePlaybackReaction implements ReactionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async execute(_params: object, context?: { userId: number }): Promise<void> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.spotifyService.pause(context.userId);
  }
}
