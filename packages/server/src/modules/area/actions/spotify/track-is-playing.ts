import { Injectable, BadRequestException } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

interface TrackPlayingState {
  lastTrackId?: string;
}

@Action({
  name: 'spotify.track_is_playing',
  description: 'Triggers when a track is currently playing on Spotify',
  parameters: {},
})
@Injectable()
export class SpotifyTrackIsPlayingAction implements ActionHandler {
  constructor(private readonly spotifyService: SpotifyService) {}

  async check(
    _parameters: object,
    currentState: TrackPlayingState | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    if (!context?.userId) {
      throw new BadRequestException('User ID is required');
    }

    const track = await this.spotifyService.getCurrentTrack(context.userId);
    const state = currentState ?? {};

    if (!track?.is_playing) {
      return { triggered: false, newState: state };
    }

    const isNewTrack = track.id !== state.lastTrackId;

    return {
      triggered: isNewTrack,
      newState: {
        lastTrackId: track.id,
        currentTrack: {
          id: track.id,
          name: track.name,
          artists: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          uri: `spotify:track:${track.id}`,
          url: track.external_urls.spotify.split('?')[0],
          progress: track.progress_ms,
          duration: track.duration_ms,
        },
      },
    };
  }
}
