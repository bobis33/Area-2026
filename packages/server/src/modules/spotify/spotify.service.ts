import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';

export interface SpotifyCurrentTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { id: string; name: string; images: { url: string }[] };
  duration_ms: number;
  progress_ms: number;
  is_playing: boolean;
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  owner: { display_name: string };
  public: boolean;
  tracks: { total: number };
  images: { url: string }[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string };
  duration_ms: number;
  external_urls: { spotify: string };
}

@Injectable()
export class SpotifyService {
  private readonly apiBaseUrl = 'https://api.spotify.com/v1';

  constructor(private readonly prisma: PrismaService) {}

  async getAccessToken(userId: number): Promise<string> {
    const account = await this.prisma.providerAccount.findFirst({
      where: {
        user_id: userId,
        provider: 'spotify',
      },
    });

    if (!account || !account.access_token) {
      throw new BadRequestException('Spotify account not linked');
    }

    return account.access_token;
  }

  private async request<T>(
    accessToken: string,
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.apiBaseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: any = await response.json().catch(() => ({}));
      throw new BadRequestException(
        (error?.error?.message as string) ||
          `Spotify API error: ${response.status}`,
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }

  async getCurrentTrack(userId: number): Promise<SpotifyCurrentTrack | null> {
    const accessToken = await this.getAccessToken(userId);

    try {
      const response = await this.request<{
        item: Omit<SpotifyCurrentTrack, 'is_playing'> | null;
        is_playing: boolean;
      }>(accessToken, '/me/player/currently-playing');

      if (response.item) {
        return {
          ...response.item,
          is_playing: response.is_playing,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async getPlaylists(
    userId: number,
    limit: number = 20,
    offset: number = 0,
  ): Promise<SpotifyPlaylist[]> {
    const accessToken = await this.getAccessToken(userId);

    const response = await this.request<{ items: SpotifyPlaylist[] }>(
      accessToken,
      `/me/playlists?limit=${limit}&offset=${offset}`,
    );

    return response.items;
  }

  async getSavedTracks(
    userId: number,
    limit: number = 20,
    offset: number = 0,
  ): Promise<SpotifyTrack[]> {
    const accessToken = await this.getAccessToken(userId);

    const response = await this.request<{
      items: { track: SpotifyTrack }[];
    }>(accessToken, `/me/tracks?limit=${limit}&offset=${offset}`);

    return response.items.map((item) => item.track);
  }

  async play(userId: number): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, '/me/player/play', {
      method: 'PUT',
    });
  }

  async pause(userId: number): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, '/me/player/pause', {
      method: 'PUT',
    });
  }

  async nextTrack(userId: number): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, '/me/player/next', {
      method: 'POST',
    });
  }

  async previousTrack(userId: number): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, '/me/player/previous', {
      method: 'POST',
    });
  }

  async search(
    userId: number,
    query: string,
    type: 'track' | 'artist' | 'album' = 'track',
    limit: number = 10,
  ): Promise<SpotifyTrack[]> {
    const accessToken = await this.getAccessToken(userId);

    const response = await this.request<{ tracks: { items: SpotifyTrack[] } }>(
      accessToken,
      `/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
    );

    return response.tracks.items;
  }

  async addTrackToPlaylist(
    userId: number,
    playlistId: string,
    trackUri: string,
  ): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, `/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ uris: [trackUri] }),
    });
  }

  async saveTrack(userId: number, trackId: string): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, `/me/tracks?ids=${trackId}`, {
      method: 'PUT',
    });
  }

  async playTrack(userId: number, trackUri: string): Promise<void> {
    const accessToken = await this.getAccessToken(userId);

    await this.request<void>(accessToken, '/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri] }),
    });
  }

  async getUserProfile(userId: number) {
    const accessToken = await this.getAccessToken(userId);

    return this.request(accessToken, '/me');
  }
}
