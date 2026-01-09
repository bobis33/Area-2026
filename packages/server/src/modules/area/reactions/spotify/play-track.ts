import { Injectable, BadRequestException } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Reaction({
  parameters: {
    trackUri: {
      type: 'string',
      description: 'The Spotify track URI or URL to play',
      example: 'spotify:track:4cOdK2wGLETKBW3PvgPWqLv',
    },
  },
  name: 'spotify.play_track',
  description: 'Plays a specific track on Spotify',
})
@Injectable()
export class SpotifyPlayTrackReaction implements ReactionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async execute(
    params: { trackUri: string },
    context?: { userId: number },
  ): Promise<void> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.spotifyService.playTrack(context.userId, params.trackUri);
  }
}
