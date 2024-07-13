import prisma from '@/services/db.service';
import { ResponseStatus } from '@/types/main';
import { Song } from '@prisma/client';
import superjson from 'superjson';

export async function getAllSongs(): Promise<Song[]> {
  const songs = await prisma.song.findMany();
  return superjson.parse<Song[]>(superjson.stringify(songs));
}

export async function getSongById(songId: string): Promise<Song | ResponseStatus.NotFound> {
  const song = await prisma.song.findUnique({ where: { id: songId } });
  if (!song) return ResponseStatus.NotFound;
  return superjson.parse<Song>(superjson.stringify(song));
}

export async function getSongsByIds(songIds: string[]): Promise<Song[] | ResponseStatus.NotFound> {
  if (songIds.length === 0) return [];

  const songs = await prisma.song.findMany({ where: { id: { in: songIds } } });
  if (!songs) return ResponseStatus.NotFound;
  return superjson.parse<Song[]>(superjson.stringify(songs));
}
