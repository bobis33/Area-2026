import { Module } from '@nestjs/common';
import { SpotifyService } from '@modules/spotify/spotify.service';

@Module({
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
