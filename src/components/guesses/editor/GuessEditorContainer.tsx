import React from 'react';
import Link from 'next/link';
import GuessEditor from '@/components/guesses/GuessEditor';
import { ShowInfo } from '@/components/shared/RunInfo';
import BackArrow from '@/components/shared/BackArrow';
import { Guess, Song } from '@prisma/client';
import { ShowWithVenue } from '@/models/show.model';
import { RunWithVenue } from '@/models/run.model';
import { useThemeContext } from '@/store/theme.store';

export interface GuessEditorContainerProps {
  run: RunWithVenue;
  show: ShowWithVenue;
  runShows: ShowWithVenue[];
  currentGuesses: Guess[];
  allSongs: Song[];
  forbiddenReason?: string | null; // valid data, but cannot edit for some reason
}

const GuessEditorContainer: React.FC<GuessEditorContainerProps> = ({
  run,
  show,
  runShows,
  currentGuesses,
  allSongs,
  forbiddenReason,
}) => {
  const { color } = useThemeContext();

  return (
    <div id="guess-editor-page">
      <div className="flex flex-col items-center">
        <div className="flex justify-center w-full max-w-500 relative mt-4">
          <p className="text-2xl font-light mt-3 mb-2">Guesses</p>
          <div className="flex items-center space-x-2 absolute top-2 left-2 -translate-y-1/2 ">
            <BackArrow
              width={16}
              height={16}
              className="cursor-pointer flex items-center space-x-2"
              svgClass="fill-black dark:fill-white"
            >
              <p className="">Shows</p>
            </BackArrow>
          </div>
          <div className="absolute top-2 right-2 -translate-y-1/2">
            <Link href={`/guesses/run/${run.id}?night=${show.runNight}`} className={`text-${color} my-2.5`}>
              All Guesses
            </Link>
          </div>
        </div>
      </div>
      <ShowInfo show={show} run={run} runShows={runShows} large />
      {forbiddenReason ? (
        <p className="text-center mt-8">{forbiddenReason}</p>
      ) : (
        <div className="w-full">
          <GuessEditor run={run} show={show} runShows={runShows} allGuesses={currentGuesses} allSongs={allSongs} />
        </div>
      )}
    </div>
  );
};

export default GuessEditorContainer;
