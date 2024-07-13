import { createGuess, deleteGuess, fetchGuessesForUserForRun, fetchGuessesForUserForShow } from '@/client/guess.client';
import CloseIcon from '@/media/CloseIcon.svg';
import { useThemeContext } from '@/store/theme.store';
import { ResponseStatus } from '@/types/main';
import { removeDuplicateSongGuesses, sortIncompleteGuesses } from '@/utils/guess.util';
import { Guess, Run, Show, Song } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import LoadingOverlay from '../shared/LoadingOverlay';
import GuessSelectorModal, { PreviousGuess } from './GuessSelectorModal';
import GuessSlot from './GuessSlot';
import SongSuggestModal from './SongSuggestModal';

Modal.setAppElement('#__next');

interface GuessEditorProps {
  run: Run;
  show: Show;
  runShows: Show[];
  allGuesses: Guess[];
  allSongs: Song[];
}

const HelpText = ({ close }: { close: () => void }) => (
  <div className="flex justify-center items-center space-x-1 mt-2.5">
    <p className="text-center opacity-50">(Click on an open slot to input your guess)</p>
    <div className="cursor-pointer" onClick={close}>
      <CloseIcon width={16} height={16} className="fill-black opacity-50" />
    </div>
  </div>
);

const MissingText = ({ open, close }: { open: () => void; close: () => void }) => (
  <div className="flex justify-center items-center space-x-1 mt-2.5">
    <p className="text-center cursor-pointer opacity-50" onClick={open}>
      Missing a Song?
    </p>
    <div className="cursor-pointer" onClick={close}>
      <CloseIcon width={16} height={16} className="fill-black opacity-50 cursor-pointer" />
    </div>
  </div>
);

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

const GuessEditor: React.FC<GuessEditorProps> = ({ run, show, runShows, allGuesses, allSongs }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const showId = parseInt(router.query.showId?.toString() || '');
  const currentUserId = session?.user?.id;
  const { color } = useThemeContext();
  const showNights: Record<number, number> = Object.fromEntries(runShows.map((s) => [s.id, s.runNight]));

  const [guesses, setGuesses] = useState<Guess[]>(allGuesses);
  const guessList: (Guess | null)[] = formatGuesses(guesses);

  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestModalOpen, setModalOpen] = useState(false);
  const [helpTextOpen, setHelpTextOpen] = useState(true);
  const [missingTextOpen, setMissingTextOpen] = useState(true);
  const [guessSelectorOpen, setGuessSelectorOpen] = useState(false);
  const [previousGuesses, setPreviousGuesses] = useState<PreviousGuess[] | null>(null);

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 });
  };

  const submitGuess = async (songId: string, encore: boolean) => {
    const song = allSongs.find((s) => s.id === songId);
    if (!song || !currentUserId || !run || isNaN(showId)) return;
    setLoading(true);
    const result = await createGuess(currentUserId, run.id, showId, songId, song.name, encore);
    if (result === ResponseStatus.Conflict) {
      showError('You have already guesses this song for this show!');
    } else if (result === ResponseStatus.UnknownError) {
      showError('An unknown error occurred when adding this guess.');
    } else {
      setGuesses((g) => [...g, result]);
    }
    setLoading(false);
    setSelectedSongId(null);
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
    setSelectedSongId(null);
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
            songPoints: allSongs.find((s) => s.id === guess.songId)?.points || 0,
          }))
        )
      );
      setGuessSelectorOpen(true);
    }
  };

  const copyPreviousGuesses = async () => {
    setLoading(true);
    if (!show || !run || show.runNight === 0 || !currentUserId) return;
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

  const copyAllPreviousGuesses = async () => {
    if (!show || !run || !currentUserId) return;
    setLoading(true);
    const guesses = await fetchGuessesForUserForRun(currentUserId, run.id);
    if (guesses === ResponseStatus.NotFound) {
      showError('Could not collect previous guesses.');
      setLoading(false);
      return;
    }
    const currentSongs = guessList.map((g) => g?.songId);
    let incompleteGuesses = guesses.filter(
      (guess) => !guess.completed && guess.showId !== show.id && !currentSongs.includes(guess.songId)
    );
    // remove duplicates
    incompleteGuesses = removeDuplicateSongGuesses(incompleteGuesses);
    await addIncompleteGuesses(incompleteGuesses);
    setLoading(false);
  };

  return (
    <div id="guess-list-page" className="mb-20">
      {loading && <LoadingOverlay />}
      <div className="overflow-y-scroll max-w-[750px] mx-auto space-y-4 px-5 mt-4">
        {guessList.map((guess, idx) => (
          <GuessSlot
            key={`slot-${idx}`}
            guess={guess}
            slotIdx={idx}
            numSlots={guessList.length}
            selectedSongId={selectedSongId}
            submitGuess={submitGuess}
            subtractGuess={subtractGuess}
            allSongs={allSongs}
          />
        ))}
      </div>
      {show.runNight > 1 && (
        <p onClick={copyPreviousGuesses} className={`text-center text-${color} cursor-pointer my-4`}>
          Copy Last Night&apos;s Incomplete Guesses
        </p>
      )}
      <p onClick={copyAllPreviousGuesses} className={`text-center text-${color} cursor-pointer my-4`}>
        Copy All Incomplete Guesses From Run
      </p>
      {helpTextOpen && <HelpText close={() => setHelpTextOpen(false)} />}
      {missingTextOpen && <MissingText open={() => setModalOpen(true)} close={() => setMissingTextOpen(false)} />}
      <Modal
        isOpen={suggestModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Song Suggestion"
        style={{ content: { top: '62px', left: '12px', right: '12px', bottom: '12px' } }}
      >
        {show.runNight > 0 && <SongSuggestModal close={() => setModalOpen(false)} />}
      </Modal>
      {guessSelectorOpen && previousGuesses && (
        <GuessSelectorModal
          close={() => setGuessSelectorOpen(false)}
          currentGuesses={guessList}
          previousGuesses={previousGuesses}
          submitGuesses={fillIncompleteGuesses}
        />
      )}
    </div>
  );
};

export default GuessEditor;
