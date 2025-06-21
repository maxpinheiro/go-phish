import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { ShowIdAndRunNight, ShowWithRun } from '@/models/show.model';
import { useGuessEditorManager } from '@/store/guessEditor.manager';
import { useSongContext } from '@/store/song.store';
import { useThemeContext } from '@/store/theme.store';
import { Guess } from '@prisma/client';
import React from 'react';
import GuessSelectorModal from '../GuessSelectorModal';
import GuessSlot from '../GuessSlot';
import GuessEditorTools from './GuessEditorTools';

interface GuessEditorProps {
  currentUserId: number;
  show: ShowWithRun;
  runShows: ShowIdAndRunNight[];
  currentGuesses: Guess[];
}

const GuessEditor: React.FC<GuessEditorProps> = ({ currentUserId, show, runShows, currentGuesses }) => {
  const { color } = useThemeContext();
  const { songLookup } = useSongContext();

  const {
    guessList,
    loading,
    submitGuess,
    subtractGuess,
    fillIncompleteGuesses,
    copyPreviousGuesses,
    previousGuesses,
    guessSelectorOpen,
    closeGuessSelector,
  } = useGuessEditorManager({
    currentGuesses,
    show,
    currentUserId,
    runShows,
    songLookup,
  });

  return (
    <div id="guess-list-page" className="mb-20">
      {loading && <LoadingOverlay />}
      <div className="overflow-y-scroll max-w-[750px] mx-auto space-y-4 px-5 my-4">
        {guessList.map((guess, idx) => (
          <GuessSlot
            key={`slot-${idx}`}
            guess={guess}
            slotIdx={idx}
            numSlots={guessList.length}
            submitGuess={submitGuess}
            subtractGuess={subtractGuess}
          />
        ))}
      </div>
      {show.runNight > 1 && (
        <p onClick={copyPreviousGuesses} className={`text-center text-${color} cursor-pointer my-4`}>
          Copy Previous Incomplete Guesses
        </p>
      )}
      <GuessEditorTools />
      {guessSelectorOpen && previousGuesses && (
        <GuessSelectorModal
          close={closeGuessSelector}
          currentGuesses={guessList}
          previousGuesses={previousGuesses}
          submitGuesses={fillIncompleteGuesses}
        />
      )}
    </div>
  );
};

export default GuessEditor;
