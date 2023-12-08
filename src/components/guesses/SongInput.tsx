import { useState } from 'react';
import { stringSimilarity } from '@/utils/utils';
import { Song } from '@prisma/client';
import { useThemeContext } from '@/store/theme.store';

interface SongInputProps {
  selectedSong: string | null;
  selectSong: (song: Song) => void;
  allSongs: Song[];
  preserveInput?: boolean;
}

const SongInput: React.FC<SongInputProps> = ({ selectedSong, selectSong, allSongs, preserveInput = false }) => {
  const [songInput, setSongInput] = useState('');
  const [songResults, setSongResults] = useState<Song[]>([]);
  const { color } = useThemeContext();

  const searchSong = (query: string) => {
    if (query === '') {
      setSongResults([]);
      return;
    }
    let songs = allSongs.filter((song) => song.name.toLowerCase().includes(query.toLowerCase()));
    //let songs = allSongs.filter(song => song.name.toLowerCase().startsWith(query.toLowerCase()));
    songs = songs.sort((song1, song2) => stringSimilarity(song2.name, query) - stringSimilarity(song1.name, query));

    const topSongs = songs.slice(0, 3);
    setSongResults(topSongs);
  };

  const chooseSong = (song: Song) => {
    selectSong(song);
    if (!preserveInput) {
      setSongInput('');
      setSongResults([]);
    }
  };

  return (
    <div className={`border border-${color} rounded-xl flex-1 flex flex-col`}>
      <input
        className={`bg-${color} bg-opacity-10 border border-${color} rounded-xl flex-1 py-1 px-2.5 border-t-0 content-box `}
        type="text"
        value={songInput}
        onChange={(e) => {
          setSongInput(e.target.value);
          searchSong(e.target.value);
        }}
        placeholder="Song Name"
      />
      {songResults.length > 0 && (
        <div className="flex flex-col space-y-2.5 p-2.5">
          {songResults.map((song, idx) => (
            <div
              key={song.id}
              onClick={() => chooseSong(song)}
              className={`result-item cursor-pointer flex items-center w-full text-sm ${
                selectedSong === song.id && 'selected'
              } ${idx % 2 === 0 ? '' : 'opacity-80'}`}
            >
              <p className="flex flex-1">{song.name}</p>
              <p className="opacity-50">
                {song.points} pt{song.points > 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongInput;
