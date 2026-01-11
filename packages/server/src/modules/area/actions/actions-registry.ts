import { TimeCronAction } from '@modules/area/actions/time/cron';
import { GithubNewNotificationAction } from '@modules/area/actions/github/new-notification';
import { SpotifyNewSavedTrackAction } from '@modules/area/actions/spotify/new-saved-track';
import { SpotifyTrackIsPlayingAction } from '@modules/area/actions/spotify/track-is-playing';
import { ActionHandler } from '@interfaces/area.interface';

export const ActionsRegistry: Record<
  string,
  new (...args: any[]) => ActionHandler
> = {
  'time.cron': TimeCronAction,
  'github.new_notification': GithubNewNotificationAction,
  'spotify.new_saved_track': SpotifyNewSavedTrackAction,
  'spotify.track_is_playing': SpotifyTrackIsPlayingAction,
};
