import CloseIcon from '@/media/CloseIcon.svg';
import { useThemeContext } from '@/store/theme.store';
import { Guess } from '@prisma/client';
import React, { useState } from 'react';
import CheckboxInput from '../shared/CheckboxInput';

export type PreviousGuess = Guess & {
  runNight: number;
  songPoints: number;
};

interface GuessSelectorModalProps {
  close: () => void;
  submitGuesses: (guesses: Guess[]) => void;
  currentGuesses: (Guess | null)[];
  previousGuesses: PreviousGuess[];
}

const GuessSelectorModal: React.FC<GuessSelectorModalProps> = ({
  close,
  submitGuesses,
  currentGuesses: initGuesses,
  previousGuesses,
}) => {
  const initRemainingSlots = initGuesses.filter((g) => g === null).length;
  const [remainingSlots, setRemainingSlots] = useState(initRemainingSlots);
  const [encoreOpen, setEncoreOpen] = useState(initGuesses[initGuesses.length - 1] === null);
  const remainingNormal = remainingSlots - (encoreOpen ? 1 : 0);
  const [selectedGuesses, setSelectedGuesses] = useState<Guess[]>([]);
  const { color } = useThemeContext();

  const toggleGuess = (guess: Guess) => {
    if (selectedGuesses.includes(guess)) {
      setSelectedGuesses(selectedGuesses.filter((g) => g.id !== guess.id));
      setRemainingSlots((x) => x + 1);
      if (guess.encore) setEncoreOpen(true);
    } else {
      if (remainingSlots === 0 || (guess.encore ? !encoreOpen : remainingNormal === 0)) return;
      setSelectedGuesses([...selectedGuesses, guess]);
      setRemainingSlots((x) => x - 1);
      if (guess.encore) setEncoreOpen(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-20 bg-black/10 px-6 py-6" id="guess-selector-modal">
      <div
        className={`flex flex-col w-full h-full max-h-screen rounded-lg bg-white dark:bg-neutral-900 border border-black px-5 py-2 relative text-black dark:text-white`}
      >
        <div className="absolute top-3 right-3 cursor-pointer" onClick={close}>
          <CloseIcon width={24} height={24} />
        </div>
        <p className="text-2xl mx-auto mt-4">Copy Previous Guesses</p>
        <p className="text-center my-2">{remainingSlots}/10 Remaining Guesses</p>
        <div className="flex flex-col space-y-4 flex-1 overflow-y-scroll mt-2">
          {previousGuesses.map((guess, idx) => (
            <div
              key={`guess-${idx}`}
              className="w-full flex items-center space-x-2 aria-disabled:opacity-30"
              aria-disabled={!selectedGuesses.includes(guess) && (guess.encore ? !encoreOpen : remainingNormal === 0)}
            >
              <CheckboxInput checked={selectedGuesses.includes(guess)} onToggle={() => toggleGuess(guess)} />
              <p className="flex-1 text-ellipsis">
                {guess.songName}
                {guess.encore ? ' (e)' : ''}
              </p>
              <p>
                N{guess.runNight}&nbsp;•&nbsp;
                {guess.songPoints}&nbsp;pt{guess.songPoints > 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
        <button
          className={`w-full border border-${color} rounded-lg py-2 cursor-pointer mb-2`}
          onClick={() => submitGuesses(selectedGuesses)}
          disabled={selectedGuesses.length > initRemainingSlots}
        >
          <p className={`text-${color}`}>Add Songs</p>
        </button>
      </div>
    </div>
  );
};

export default GuessSelectorModal;
