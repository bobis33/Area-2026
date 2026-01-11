import { Injectable, BadRequestException } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Reaction({
  parameters: {
    playlistId: {
      type: 'string',
      description: 'The Spotify playlist ID or URL',
      example: '37i9dQZF1DX4UtSsGT1Sbe',
    },
    trackUri: {
      type: 'string',
      description: 'The Spotify track URI or URL to add',
      example: 'spotify:track:4cOdK2wGLETKBW3PvgPWqLv',
    },
  },
  name: 'spotify.add_to_playlist',
  description: 'Adds a track to a Spotify playlist',
})
@Injectable()
export class SpotifyAddToPlaylistReaction implements ReactionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async execute(
    params: { playlistId: string; trackUri: string },
    context?: { userId: number },
  ): Promise<void> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.spotifyService.addTrackToPlaylist(
      context.userId,
      params.playlistId,
      params.trackUri,
    );
  }
}
