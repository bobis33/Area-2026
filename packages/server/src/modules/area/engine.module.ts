import { Module } from '@nestjs/common';
import { EngineService } from '@modules/area/engine.service';
import { PrismaService } from '@common/database/prisma.service';
import { DiscordModule } from '@modules/discord/discord.module';
import { GithubModule } from '@modules/github/github.module';
import { GitlabModule } from '@modules/gitlab/gitlab.module';
import { GithubNewNotificationAction } from '@modules/area/actions/github/new-notification';
import { GmailModule } from '@modules/gmail/gmail.module';
import { SpotifyModule } from '@modules/spotify/spotify.module';
import { TimeCronAction } from '@modules/area/actions/time/cron';
import { SpotifyNewSavedTrackAction } from '@modules/area/actions/spotify/new-saved-track';
import { SpotifyTrackIsPlayingAction } from '@modules/area/actions/spotify/track-is-playing';
import { DiscordSendMessageChannelReaction } from '@modules/area/reactions/discord/send-message-channel';
import { DiscordSendMessageUserReaction } from '@modules/area/reactions/discord/send-message-user';
import { GmailSendEmailReaction } from '@modules/area/reactions/gmail/send-email';
import { GmailCreateDraftReaction } from '@modules/area/reactions/gmail/create-draft';
import { SpotifyAddToLikedReaction } from '@modules/area/reactions/spotify/add-to-liked';
import { SpotifyAddToPlaylistReaction } from '@modules/area/reactions/spotify/add-to-playlist';
import { SpotifyPlayTrackReaction } from '@modules/area/reactions/spotify/play-track';
import { SpotifyPausePlaybackReaction } from '@modules/area/reactions/spotify/pause-playback';
import { SpotifyResumePlaybackReaction } from '@modules/area/reactions/spotify/resume-playback';
import { SpotifySkipNextReaction } from '@modules/area/reactions/spotify/skip-next';
import { AreaService } from '@modules/area/area.service';
import { AreaController } from '@modules/area/area.controller';

@Module({
  imports: [DiscordModule, GmailModule, GithubModule, SpotifyModule],
  providers: [
    AreaService,
    EngineService,
    PrismaService,
    GithubNewNotificationAction,
    TimeCronAction,
    AreaService,
    GithubNewNotificationAction,
    SpotifyNewSavedTrackAction,
    SpotifyTrackIsPlayingAction,
    DiscordSendMessageChannelReaction,
    DiscordSendMessageUserReaction,
    GmailSendEmailReaction,
    GmailCreateDraftReaction,
    SpotifyAddToLikedReaction,
    SpotifyAddToPlaylistReaction,
    SpotifyPlayTrackReaction,
    SpotifyPausePlaybackReaction,
    SpotifyResumePlaybackReaction,
    SpotifySkipNextReaction,
  ],
  controllers: [AreaController],
})
export class EngineModule {}
