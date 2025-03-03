import { stringSimilarity } from '@/utils/utils';
import { Song } from '@prisma/client';
import { ReactNode, createContext, useContext, useState } from 'react';

type SongContextType = {
  allSongs: Song[];
  songLookup: Record<string, Song>;
  setAllSongs: (songs: Song[]) => void;
  searchSong: (query: string) => Song[];
};

const SongContext = createContext<SongContextType>({
  allSongs: [],
  songLookup: {},
  setAllSongs: () => {},
  searchSong: (_) => [],
});

export function SongContextWrapper({ children }: { children: ReactNode }) {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const songLookup: Record<string, Song> = Object.fromEntries(allSongs.map((s) => [s.id, s]));

  const searchSong = (query: string): Song[] => {
    if (query === '') {
      return [];
    }
    let songs = allSongs.filter((song) => song.name.toLowerCase().includes(query.toLowerCase()));
    //let songs = allSongs.filter(song => song.name.toLowerCase().startsWith(query.toLowerCase()));
    songs = songs.sort((song1, song2) => stringSimilarity(song2.name, query) - stringSimilarity(song1.name, query));

    const topSongs = songs.slice(0, 3);
    return topSongs;
  };

  const value = {
    allSongs,
    songLookup,
    setAllSongs,
    searchSong,
  };

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
}

export function useSongContext() {
  return useContext(SongContext);
}
