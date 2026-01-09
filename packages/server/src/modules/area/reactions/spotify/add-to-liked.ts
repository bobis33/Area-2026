import { Injectable } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Reaction({
  parameters: {
    trackUri: {
      type: 'string',
      description: 'The Spotify track URI to save (e.g., spotify:track:xxx)',
      example: 'spotify:track:4cOdK2wGLETKBW3PvgPWqLv',
    },
  },
  name: 'spotify.add_to_liked',
  description: 'Adds a track to your Spotify liked songs',
})
@Injectable()
export class SpotifyAddToLikedReaction implements ReactionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async execute(
    params: { trackUri: string },
    context?: { userId: number },
  ): Promise<void> {
    let { trackUri } = params;

    // Remove query parameters (e.g., ?si=xxx)
    trackUri = trackUri.split('?')[0];

    let trackId: string;

    // Support both URI (spotify:track:ID) and URL (https://open.spotify.com/track/ID)
    if (trackUri.startsWith('spotify:track:')) {
      trackId = trackUri.split(':')[2];
    } else if (trackUri.includes('spotify.com/track/')) {
      const match = trackUri.match(/track\/([a-zA-Z0-9]+)/);
      trackId = match ? match[1] : '';
    } else {
      throw new Error(
        'Invalid track URI/URL format. Expected spotify:track:ID or https://open.spotify.com/track/ID',
      );
    }

    if (!trackId) {
      throw new Error('Could not extract track ID');
    }

    await this.spotifyService.saveTrack(context!.userId, trackId);
  }
}
