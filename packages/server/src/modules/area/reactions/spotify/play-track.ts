import { Injectable } from '@nestjs/common';
import { ReactionHandler } from '@interfaces/area.interface';
import { Reaction } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Reaction({
  parameters: {
    trackUri: {
      type: 'string',
      description: 'The Spotify track URI to play (e.g., spotify:track:xxx)',
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
    let { trackUri } = params;

    trackUri = trackUri.split('?')[0];

    let finalTrackUri: string;

    if (trackUri.startsWith('spotify:track:')) {
      finalTrackUri = trackUri;
    } else if (trackUri.includes('spotify.com/track/')) {
      const match = trackUri.match(/track\/([a-zA-Z0-9]+)/);
      const trackId = match ? match[1] : '';
      if (!trackId) {
        throw new Error('Could not extract track ID from URL');
      }
      finalTrackUri = `spotify:track:${trackId}`;
    } else {
      throw new Error(
        'Invalid track URI/URL format. Expected spotify:track:ID or https://open.spotify.com/track/ID',
      );
    }

    await this.spotifyService.playTrack(context!.userId, finalTrackUri);
  }
}
