import { ResponseStatus } from '@/types/main';
import { Guess, Run, Show, Song } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Modal from 'react-modal';
import CloseIcon from '@/media/CloseIcon.svg';
import LoadingSpinner from '../shared/LoadingSpinner';
import SongInput from './SongInput';
import SongSuggestModal from './SongSuggestModal';
import { createGuess, deleteGuess, fetchGuessesForUserForShow } from '@/client/guess.client';
import LoadingOverlay from '../shared/LoadingOverlay';
import { useThemeContext } from '@/store/theme.store';
import toast from 'react-hot-toast';

Modal.setAppElement('#__next');

interface GuessEditorProps {
  run: Run;
  show: Show;
  runShows: Show[];
  allGuesses: Guess[];
  allSongs: Song[];
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

const GuessEditor: React.FC<GuessEditorProps> = ({ run, show, runShows, allGuesses, allSongs }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const showId = parseInt(router.query.showId?.toString() || '');
  const currentUserId = session?.user?.id;
  const { color } = useThemeContext();

  const [guesses, setGuesses] = useState<Guess[]>(allGuesses);
  const guessList: (Guess | null)[] = formatGuesses(guesses);

  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestModalOpen, setModalOpen] = useState(false);
  const [helpTextOpen, setHelpTextOpen] = useState(true);
  const [missingTextOpen, setMissingTextOpen] = useState(true);

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 });
  };

  const selectSong = (songId: string) => {
    setSelectedSong((currId) => (currId === songId ? null : songId));
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
    setSelectedSong(null);
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
    setSelectedSong(null);
  };

  const addIncompleteGuesses = async (guesses: Guess[]) => {
    let availableSlots = guessList.filter((g) => g === null).length;
    // if already full, can't add guesses
    if (availableSlots === 0) {
      showError('You have already made all of your guesses!');
    }
    const incompleteGuesses = guesses.filter((guess) => !guess.completed);
    for (let guess of incompleteGuesses) {
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
    setLoading(false);
  };

  const getPreviousGuesses = async () => {
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
    addIncompleteGuesses(guesses);
  };

  return (
    <div id="guess-list-page" className="mb-20">
      {helpTextOpen && (
        <div className="flex justify-center items-center space-x-1 mt-2.5">
          <p className="text-center opacity-50">(Click on an open slot to input your guess)</p>
          <div className="cursor-pointer" onClick={() => setHelpTextOpen(false)}>
            <CloseIcon width={16} height={16} className="fill-black opacity-50" />
          </div>
        </div>
      )}
      {missingTextOpen && (
        <div className="flex justify-center items-center space-x-1 mt-2.5">
          <p className="text-center cursor-pointer opacity-50" onClick={() => setModalOpen(true)}>
            Missing a Song?
          </p>
          <div className="cursor-pointer" onClick={() => setMissingTextOpen(false)}>
            <CloseIcon width={16} height={16} className="fill-black opacity-50 cursor-pointer" />
          </div>
        </div>
      )}
      {loading && <LoadingOverlay />}
      <div className="overflow-y-scroll max-w-[750px] mx-auto space-y-4 px-5 mt-4">
        {guessList.map((guess, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between w-full space-x-1 ${guess === null ? 'align-start' : ''}`}
          >
            <div className="flex h-full items-center">
              <p className="m-0">{idx < guessList.length - 1 ? `Song ${idx + 1}` : 'Encore'}:</p>
            </div>
            {guess !== null ? (
              <div
                className={`bg-${color} bg-opacity-10 border border-${color} rounded-xl flex-1 py-1 px-2.5 ${
                  guess === null && selectedSong !== null ? 'song-choice-highlight' : ''
                }`}
                onClick={() =>
                  guess === null && selectedSong !== null ? submitGuess(selectedSong, idx === guessList.length - 1) : {}
                }
              >
                <p className="m-0 ">{guess?.songName}&nbsp;</p>
              </div>
            ) : (
              <SongInput
                selectedSong={selectedSong}
                selectSong={(song) => submitGuess(song.id, idx === guessList.length - 1)}
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
        ))}
      </div>
      {
        <p onClick={getPreviousGuesses} className={`text-center text-${color} cursor-pointer my-4`}>
          Copy Incomplete Guesses From Previous Night
        </p>
      }
      <Modal
        isOpen={suggestModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Song Suggestion"
        style={{ content: { top: '62px', left: '12px', right: '12px', bottom: '12px' } }}
      >
        {show && show.runNight > 0 && <SongSuggestModal close={() => setModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default GuessEditor;
