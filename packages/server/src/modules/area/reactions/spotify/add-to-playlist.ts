import { Injectable } from '@nestjs/common';
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
    let { playlistId, trackUri } = params;
    let finalTrackUri: string;
    let finalPlaylistId: string;

    // Clean query parameters (e.g., ?si=xxx)
    trackUri = trackUri.split('?')[0];
    playlistId = playlistId.split('?')[0];

    // Extract playlist ID from URI or URL
    if (playlistId.startsWith('spotify:playlist:')) {
      finalPlaylistId = playlistId.split(':')[2];
    } else if (playlistId.includes('spotify.com/playlist/')) {
      const match = playlistId.match(/playlist\/([a-zA-Z0-9]+)/);
      finalPlaylistId = match ? match[1] : '';
      if (!finalPlaylistId) {
        throw new Error('Could not extract playlist ID from URL');
      }
    } else {
      // Assume it's already a raw ID
      finalPlaylistId = playlistId;
    }

    // Support both URI (spotify:track:ID) and URL (https://open.spotify.com/track/ID)
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

    await this.spotifyService.addTrackToPlaylist(
      context!.userId,
      finalPlaylistId,
      finalTrackUri,
    );
  }
}
