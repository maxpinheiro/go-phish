import GuessEditor from '@/components/guesses/GuessEditor';
import BackLink from '@/components/shared/BackLink';
import { ShowInfo } from '@/components/shared/RunInfo';
import TitleBar from '@/components/shared/TitleBar';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { Guess, Song } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

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
  const guessesUrl = `/guesses/run/${run.id}?night=${show.runNight}`;

  return (
    <div id="guess-editor-page">
      <div className="flex flex-col items-center pb-10">
        <TitleBar
          left={<BackLink text="Back" />}
          center="Guesses"
          right={
            <Link href={guessesUrl} className={`text-${color}`}>
              All Guesses
            </Link>
          }
        />
        <ShowInfo show={show} run={run} runShows={runShows} large />
        {forbiddenReason ? (
          <p className="text-center mt-8">{forbiddenReason}</p>
        ) : (
          <div className="w-full">
            <GuessEditor run={run} show={show} runShows={runShows} allGuesses={currentGuesses} allSongs={allSongs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessEditorContainer;
