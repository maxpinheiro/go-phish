import { createGuess, deleteGuess, fetchGuessesForUserForShow } from '@/client/guess.client';
import { PreviousGuess } from '@/components/guesses/GuessSelectorModal';
import { ShowIdAndRunNight, ShowWithRun } from '@/models/show.model';
import { ResponseStatus } from '@/types/main';
import { sortIncompleteGuesses } from '@/utils/guess.util';
import { showError } from '@/utils/utils';
import { Guess, Song } from '@prisma/client';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface GuessEditorManagerProps {
  show: ShowWithRun;
  currentGuesses: Guess[];
  currentUserId: number;
  runShows: ShowIdAndRunNight[];
  songLookup: Record<string, Song>;
}

const formatGuesses = (allGuesses: Guess[]): (Guess | null)[] => {
  let guesses: Guess[] = allGuesses.filter((guess) => !guess.completed);
  let nonEncore: Guess[] = [];
  let encore: Guess | null = null;
  guesses.forEach((guess) => {
    if (guess.encore) {
      if (!encore) encore = guess;
    } else {
      if (nonEncore.length < 9) nonEncore.push(guess);
    }
  });
  let guessList: (Guess | null)[] = nonEncore;
  while (guessList.length < 9) {
    guessList.push(null);
  }
  guessList.push(encore);
  return guessList;
};

export const useGuessEditorManager = ({
  currentGuesses,
  show,
  currentUserId,
  runShows,
  songLookup,
}: GuessEditorManagerProps) => {
  const showNights: Record<number, number> = Object.fromEntries(runShows.map((s) => [s.id, s.runNight]));

  const [guesses, setGuesses] = useState<Guess[]>(currentGuesses);
  const guessList: (Guess | null)[] = formatGuesses(guesses);

  const [loading, setLoading] = useState(false);
  const [guessSelectorOpen, setGuessSelectorOpen] = useState(false);
  const [previousGuesses, setPreviousGuesses] = useState<PreviousGuess[] | null>(null);

  const closeGuessSelector = () => setGuessSelectorOpen(false);

  const submitGuess = async (songId: string, encore: boolean) => {
    const song = songLookup[songId];
    if (!song) return;
    setLoading(true);
    const result = await createGuess(currentUserId, show.runId, show.id, song.id, song.name, encore);
    if (result === ResponseStatus.Conflict) {
      showError('You have already guesses this song for this show!');
    } else if (result === ResponseStatus.UnknownError) {
      showError('An unknown error occurred when adding this guess.');
    } else {
      setGuesses((g) => [...g, result]);
    }
    setLoading(false);
  };

  const subtractGuess = async (guessId: number | undefined) => {
    if (!guessId) return;
    setLoading(true);
    const result = await deleteGuess(guessId);
    if (result === ResponseStatus.Success) {
      setGuesses((g) => g.filter((guess) => guess.id !== guessId));
    } else {
      showError('Could not remove guess');
    }
    setLoading(false);
  };

  const canAddAllGuesses = (guesses: Guess[]): boolean => {
    let availableSlots = guessList.filter((g) => g === null).length;
    // cannot fill if encore present
    if (guessList[guessList.length - 1] !== null && guesses.some((g) => g.encore)) return false;
    // cannot fill two encores
    if (guesses.filter((g) => g.encore).length > 1) return false;
    return availableSlots >= guesses.length;
  };

  const fillIncompleteGuesses = async (guesses: Guess[]) => {
    let availableSlots = guessList.filter((g) => g === null).length;
    for (let guess of guesses) {
      // done if no available spot
      if (availableSlots === 0) break;
      // skip if song already guessed
      if (guessList.some((g) => g?.songId === guess.songId)) continue;
      // skip if encore and encore already used
      if (guess.encore && guessList[guessList.length - 1] !== null) continue;
      // add guess
      await submitGuess(guess.songId, guess.encore);
      availableSlots--;
    }
    toast.success('Successfully copied songs!', { duration: 3000 });
    if (guessSelectorOpen) setGuessSelectorOpen(false);
  };

  const addIncompleteGuesses = async (guesses: Guess[]) => {
    let availableSlots = guessList.filter((g) => g === null).length;
    // if already full, can't add guesses
    if (availableSlots === 0) {
      return showError('You have already made all of your guesses!');
    }
    if (guesses.length === 0) {
      return showError('No incomplete guesses to copy!');
    }

    if (canAddAllGuesses(guesses)) {
      // add all guesses automatically
      await fillIncompleteGuesses(guesses);
    } else {
      // open guess-selection modal
      setPreviousGuesses(
        sortIncompleteGuesses(
          guesses.map((guess) => ({
            ...guess,
            runNight: showNights[guess.showId],
            songPoints: songLookup[guess.songId].points || 0,
          }))
        )
      );
      setGuessSelectorOpen(true);
    }
  };

  const copyPreviousGuesses = async () => {
    if (show.runNight === 0 || !currentUserId) return;
    setLoading(true);
    const prevShow = runShows.find((s) => s.runNight === show.runNight - 1);
    if (!prevShow) {
      showError('No show found for night.');
      setLoading(false);
      return;
    }
    const guesses = await fetchGuessesForUserForShow(currentUserId, prevShow.id);
    if (guesses === ResponseStatus.NotFound) {
      showError('Could not collect previous guesses.');
      setLoading(false);
      return;
    }
    const currentSongs = guessList.map((g) => g?.songId);
    const incompleteGuesses = guesses.filter((guess) => !guess.completed && !currentSongs.includes(guess.songId));
    await addIncompleteGuesses(incompleteGuesses);
    setLoading(false);
  };

  return {
    guessList,
    loading,
    submitGuess,
    subtractGuess,
    fillIncompleteGuesses,
    copyPreviousGuesses,
    previousGuesses,
    guessSelectorOpen,
    closeGuessSelector,
  };
};
