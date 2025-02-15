import { PhishNet } from '@/models/phishnet.model';
import { ShowWithVenueAndRun } from '@/models/show.model';
import { Venue } from '@prisma/client';

// main

export type DateString = `${number}-${number}-${number}`; // yyyy-mm-dd

export type Color = `#${string}` | `rgb(${number}, ${number}, ${number})` | string;

export type ColorType = 'hex' | 'rgb' | 'css';

export interface AvatarConfigParsed {
  head: Color;
  torso: Color;
  background: Color;
}

export enum ResponseStatus {
  Success = 200,
  UnknownError = 500,
  NotFound = 404,
  Unauthorized = 401,
  Conflict = 409,
}

export enum SignupResponse {
  NameConflict = 'NAME_CONFLICT',
  EmailConflict = 'NAME_CONFLICT',
}

// song

export type SongTag = 'number' | 'animal' | 'gamehendge';

export type PhishNetSong = {
  id: string;
  name: string;
  tags: string[];
  artist: string;
  debut: DateString;
  last_played: DateString;
  times_played: number;
  gap: number;
};

// export interface Song {
//   id: string;
//   name: string;
//   tags: SongTag[];
//   artist?: string;
// }

export type SetlistSong = { id: string; name: string; encore: boolean };

export type PhishNetShow = PhishNet.Show;

// misc data

export type SortOrder = 'asc' | 'desc';

export type PrismaOrderByQuery<T> = Partial<{
  [Property in keyof T]: SortOrder;
}>;

// users

export type AvatarType = 'user' | 'donut' | 'fish' | 'alien';

export const avatarTypes: AvatarType[] = ['user', 'donut', 'fish', 'alien'];

export interface AvatarConfig {
  type?: AvatarType;
  head: Color;
  torso: Color;
  background: Color;
}

// shows

export interface ShowGroupRun {
  runId: number;
  runName: string;
  runDates: DateString[];
  shows: ShowWithVenueAndRun[];
}

export interface ShowGroupYear {
  year: number;
  showsByRun: ShowGroupRun[];
}

export interface ShowGroupVenue {
  venue: Venue;
  showsByRun: ShowGroupRun[];
}
