import { DateString } from '@/types/main';

export namespace PhishNet {
  export type Response<T> = {
    error: boolean;
    error_message: string;
    data: T;
  };
  export type Song = {
    song: string;
    slug: string;
    abbr: string;
    artist: string;
    debut: DateString;
    last_played: DateString;
    times_played: number;
    gap: number;
  };
  export const extractSong = (data: any): Song | null => {
    if (typeof data !== 'object' || data === null) {
      return null;
    }
    if (
      !data.hasOwnProperty('song') ||
      !data.hasOwnProperty('slug') ||
      !data.hasOwnProperty('abbr') ||
      !data.hasOwnProperty('artist') ||
      !data.hasOwnProperty('debut') ||
      !data.hasOwnProperty('last_played') ||
      !data.hasOwnProperty('times_played') ||
      !data.hasOwnProperty('gap')
    ) {
      return null;
    }
    return {
      song: data.song,
      slug: data.slug,
      abbr: data.abbr,
      artist: data.artist,
      debut: data.debut as DateString,
      last_played: data.last_played as DateString,
      times_played: parseInt(data.times_played),
      gap: parseInt(data.gap),
    };
  };

  export type SongListResponse = Response<Song[]>;
  export const extractSongListResponse = (data: any): SongListResponse | null => {
    if (typeof data !== 'object' || data === null) {
      return null;
    }
    if (!data.hasOwnProperty('error') || !data.hasOwnProperty('error_message') || !data.hasOwnProperty('data')) {
      return null;
    }
    if (!Array.isArray(data.data)) {
      return null;
    }
    return {
      error: Boolean(data.error),
      error_message: data.error_message,
      data: data.data,
    };
  };
  export const extractSongResponse = (data: any): Response<Song> | null => {
    if (typeof data !== 'object' || data === null) {
      return null;
    }
    if (!data.hasOwnProperty('error') || !data.hasOwnProperty('error_message') || !data.hasOwnProperty('data')) {
      return null;
    }
    if (!Array.isArray(data.data) || data.data.length < 1) {
      return null;
    }
    return {
      error: Boolean(data.error),
      error_message: data.error_message,
      data: data.data[0],
    };
  };
  export type Show = {
    showdate: DateString;
    permalink: string;
    setlist_notes: string;
    venue: string;
    city: string;
    state: string;
    country: string;
    tour_name: string;
  };
  export type ShowResponse = Response<Show[]>;
  export const extractShowResponse = (data: any): ShowResponse | null => {
    if (typeof data !== 'object' || data === null) {
      return null;
    }
    if (!data.hasOwnProperty('error') || !data.hasOwnProperty('error_message') || !data.hasOwnProperty('data')) {
      return null;
    }
    return {
      error: Boolean(data.error),
      error_message: data.error_message,
      data: data.data,
    };
  };

  export type SetlistSong = {
    set: string;
    song: string;
    slug: string;
  };
  export type SetlistResponse = Response<SetlistSong[]>;
  export const extractSetlistResponse = (data: any): SetlistResponse | null => {
    if (typeof data !== 'object' || data === null) {
      return null;
    }
    if (!data.hasOwnProperty('error') || !data.hasOwnProperty('error_message') || !data.hasOwnProperty('data')) {
      return null;
    }
    return {
      error: Boolean(data.error),
      error_message: data.error_message,
      data: data.data,
    };
  };
}
