import { ReactionHandler } from '@interfaces/area.interface';
import { Type } from '@nestjs/common';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';
import { GmailSendEmailReaction } from '@modules/area/reactions/google/gmail/send-email';
import { GmailCreateDraftReaction } from '@modules/area/reactions/google/gmail/create-draft';
import { SpotifyAddToLikedReaction } from '@modules/area/reactions/spotify/add-to-liked';
import { SpotifyAddToPlaylistReaction } from '@modules/area/reactions/spotify/add-to-playlist';
import { SpotifyPlayTrackReaction } from '@modules/area/reactions/spotify/play-track';
import { SpotifyPausePlaybackReaction } from '@modules/area/reactions/spotify/pause-playback';
import { SpotifyResumePlaybackReaction } from '@modules/area/reactions/spotify/resume-playback';
import { SpotifySkipNextReaction } from '@modules/area/reactions/spotify/skip-next';

export const ReactionsRegistry: Record<string, Type<ReactionHandler>> = {
  'discord.send_message_channel': DiscordSendMessageChannelReaction,
  'discord.send_message_user': DiscordSendMessageUserReaction,
  'gmail.send_email': GmailSendEmailReaction,
  'gmail.create_draft': GmailCreateDraftReaction,
  'spotify.add_to_liked': SpotifyAddToLikedReaction,
  'spotify.add_to_playlist': SpotifyAddToPlaylistReaction,
  'spotify.play_track': SpotifyPlayTrackReaction,
  'spotify.pause_playback': SpotifyPausePlaybackReaction,
  'spotify.resume_playback': SpotifyResumePlaybackReaction,
  'spotify.skip_next': SpotifySkipNextReaction,
};
