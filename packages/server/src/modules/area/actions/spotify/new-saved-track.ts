import { Injectable, BadRequestException } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

interface SavedTrackState {
  lastTrackId?: string;
}

@Action({
  name: 'spotify.new_saved_track',
  description: 'Triggers when a new track is saved to your Spotify library',
  parameters: {},
})
@Injectable()
export class SpotifyNewSavedTrackAction implements ActionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async check(
    _parameters: object,
    currentState: SavedTrackState | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    const tracks = await this.spotifyService.getSavedTracks(context.userId, 1);
    const state = currentState ?? {};

    if (!tracks.length) {
      return { triggered: false, newState: state };
    }

    const latestTrack = tracks[0];
    const isNewTrack = latestTrack.id !== state.lastTrackId;

    if (!isNewTrack) {
      return { triggered: false, newState: state };
    }

    return {
      triggered: true,
      newState: {
        lastTrackId: latestTrack.id,
        track: {
          id: latestTrack.id,
          name: latestTrack.name,
          artists: latestTrack.artists.map((a) => a.name).join(', '),
          album: latestTrack.album.name,
          uri: `spotify:track:${latestTrack.id}`,
          url: latestTrack.external_urls.spotify.split('?')[0],
        },
      },
    };
  }
}
