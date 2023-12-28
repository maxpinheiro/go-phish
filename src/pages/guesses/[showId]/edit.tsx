import GuessEditor from '@/components/guesses/GuessEditor';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { ShowInfo } from '@/components/shared/RunInfo';
import { ResponseStatus } from '@/types/main';
import BackArrow from '@/components/shared/BackArrow';
import { getGuessesForUserForShow } from '@/services/guess.service';
import { getRunWithVenue } from '@/services/run.service';
import { getShowWithVenue, getShowsForRunWithVenue } from '@/services/show.service';
import { Guess, Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import moment from 'moment';
import { formatShowDate } from '@/utils/show.util';
import { ShowWithVenue } from '@/models/show.model';
import { RunWithVenue } from '@/models/run.model';
import { getAllSongs } from '@/services/song.service';
import { useThemeContext } from '@/store/theme.store';

interface GuessEditorContainerProps {
  run?: RunWithVenue;
  show?: ShowWithVenue;
  runShows?: ShowWithVenue[];
  currentGuesses?: Guess[];
  allSongs?: Song[];
  error?: string;
  forbiddenReason?: string | null; // valid data, but cannot edit for some reason
}

export const getServerSideProps: GetServerSideProps<GuessEditorContainerProps> = async (context) => {
  const session = await getSession(context);
  const currentUserId = session?.user?.id;
  const showId = parseInt(context.query.showId?.toString() || '');
  if (!currentUserId) {
    return {
      props: { error: 'You must be signed in to edit guesses.' },
    };
  }
  if (isNaN(showId)) {
    return {
      props: { error: 'Missing/invalid show id.' },
    };
  }
  let showData = await getShowWithVenue(showId);
  if (showData === ResponseStatus.NotFound) {
    return {
      props: { error: 'Show not found.' },
    };
  }
  let show = JSON.parse(JSON.stringify(showData)) as typeof showData;
  // check if current day is past show day
  let forbiddenReason = null;
  // if (isPastDate(dateToDateString(show.date))) {
  // allow admins to edit previous shows
  if (!session.user.admin) {
    if (new Date() > new Date(show.timestamp)) {
      if (moment().format('YYYY-MM-DD') === moment(show.timestamp).format('YYYY-MM-DD')) {
        const startTime = formatShowDate(show, 'h:mm a z');
        forbiddenReason = `This show has already started! According to our records, the show started at ${startTime}`;
      } else {
        forbiddenReason = 'This show has already happened! You can only add guesses for upcoming shows.';
      }
    }
  }
  let runShows = await getShowsForRunWithVenue(show.runId);
  if (runShows === ResponseStatus.NotFound) {
    return {
      props: { error: 'Shows not found.' },
    };
  }
  runShows = JSON.parse(JSON.stringify(runShows)) as typeof runShows;
  let runData = await getRunWithVenue(show.runId);
  if (runData === ResponseStatus.NotFound) {
    return {
      props: { error: 'Run not found.' },
    };
  }
  let run = JSON.parse(JSON.stringify(runData)) as typeof runData;
  const guesses = await getGuessesForUserForShow(currentUserId, showId);
  if (guesses === ResponseStatus.NotFound) {
    return {
      props: { error: 'Show not found.' },
    };
  }

  // let incompleteGuesses = await getGuesesByQuery({ userId: currentUserId, runId: })

  const songs = await getAllSongs();
  return {
    props: { run, show, runShows, allSongs: songs, currentGuesses: guesses, forbiddenReason },
  };
};

const GuessEditorContainer: React.FC<GuessEditorContainerProps> = ({
  run,
  show,
  runShows,
  currentGuesses,
  allSongs,
  error,
  forbiddenReason,
}) => {
  const router = useRouter();
  const showId = parseInt(router.query.showId?.toString() || '');
  const { color } = useThemeContext();

  if (error || !run || !show || runShows === undefined || currentGuesses === undefined || !allSongs) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>{run.name} - Edit Guesses | Go Phish</title>
      </Head>
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
    </>
  );
};

export default GuessEditorContainer;
