import GuessEditorContainer, { GuessEditorContainerProps } from '@/components/guesses/editor/GuessEditorContainer';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { getGuessesForUserForShow } from '@/services/guess.service';
import { getRunWithVenue } from '@/services/run.service';
import { getShowWithVenue, getShowsForRunWithVenue } from '@/services/show.service';
import { getAllSongs } from '@/services/song.service';
import { ResponseStatus } from '@/types/main';
import { formatShowDate } from '@/utils/show.util';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

type GuessEditorPageProps = Partial<GuessEditorContainerProps> & {
  error?: string;
};

export const getServerSideProps: GetServerSideProps<GuessEditorPageProps> = async (context) => {
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

const GuessEditorPage: React.FC<GuessEditorPageProps> = ({
  run,
  show,
  runShows,
  currentGuesses,
  allSongs,
  error,
  forbiddenReason,
}) => {
  if (error || !run || !show || runShows === undefined || currentGuesses === undefined || !allSongs) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>{run.name} - Edit Guesses | Go Phish</title>
      </Head>
      <GuessEditorContainer
        run={run}
        show={show}
        runShows={runShows}
        currentGuesses={currentGuesses}
        allSongs={allSongs}
        forbiddenReason={forbiddenReason}
      />
    </>
  );
};

export default GuessEditorPage;
