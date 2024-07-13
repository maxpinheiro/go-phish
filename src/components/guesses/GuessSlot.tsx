import CloseIcon from '@/media/CloseIcon.svg';
import { useThemeContext } from '@/store/theme.store';
import { Guess, Song } from '@prisma/client';
import React from 'react';
import SongInput from './SongInput';

interface GuessSlotProps {
  guess: Guess | null;
  slotIdx: number;
  numSlots: number;
  selectedSongId: string | null;
  submitGuess: (songId: string, encore: boolean) => void;
  subtractGuess: (guessId: number) => void;
  allSongs: Song[];
}

const GuessSlot: React.FC<GuessSlotProps> = ({
  guess,
  slotIdx,
  numSlots,
  selectedSongId,
  submitGuess,
  subtractGuess,
  allSongs,
}) => {
  const { color } = useThemeContext();
  const isEncore = slotIdx === numSlots - 1;
  return (
    <div className={`flex items-center justify-between w-full space-x-1 ${guess === null ? 'align-start' : ''}`}>
      <div className="flex h-full items-center">
        <p className="m-0">{isEncore ? 'Encore' : `Song ${slotIdx + 1}`}:</p>
      </div>
      {guess !== null ? (
        <div className={`bg-${color} bg-opacity-10 border border-${color} rounded-xl flex-1 py-1 px-2.5`}>
          <p className="m-0 ">{guess?.songName}&nbsp;</p>
        </div>
      ) : (
        <SongInput
          selectedSong={selectedSongId}
          selectSong={(song) => submitGuess(song.id, isEncore)}
          allSongs={allSongs}
        />
      )}
      <div
        style={guess === null ? { opacity: 0.25, userSelect: 'none' } : { cursor: 'cursor-pointer' }}
        onClick={() => (guess !== null ? subtractGuess(guess.id) : {})}
      >
        <CloseIcon />
      </div>
    </div>
  );
};

export default GuessSlot;
