import { Injectable } from '@nestjs/common';
import { ActionHandler } from '@interfaces/area.interface';
import { Action } from '@decorators/area.decorator';
import { SpotifyService } from '@modules/spotify/spotify.service';

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
    currentState: { lastTrackId?: string; wasPlaying?: boolean } | null,
    context?: { userId: number },
  ): Promise<{ triggered: boolean; newState?: any }> {
    const track = await this.spotifyService.getCurrentTrack(context!.userId);
    const state = currentState ?? { wasPlaying: false };

    if (!track) {
      return { triggered: false, newState: { ...state, wasPlaying: false } };
    }

    const isPlaying = track.is_playing;
    const newTrack = track.id !== state.lastTrackId;

    const triggered = isPlaying && newTrack;

    return {
      triggered,
      newState: {
        lastTrackId: track.id,
        wasPlaying: isPlaying,
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
