import GuessEditorContainer, { GuessEditorContainerProps } from '@/components/guesses/editor/GuessEditorContainer';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { getGuessesForUserForShow } from '@/services/guess.service';
import { getRunWithVenue } from '@/services/run.service';
import { getShowWithVenue, getShowsForRunWithVenue } from '@/services/show.service';
import { getAllSongs } from '@/services/song.service';
import { ResponseStatus } from '@/types/main';
import { guessEditForbiddenReason } from '@/utils/guess.util';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

type GuessEditorPageProps = Partial<GuessEditorContainerProps> & {
  error?: string;
};

export const getServerSideProps: GetServerSideProps<GuessEditorPageProps> = async (context) => {
  const session = await getSession(context);
  const currentUser = session?.user;
  const showId = parseInt(context.query.showId?.toString() || '');
  if (!currentUser) {
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
  const forbiddenReason = guessEditForbiddenReason(currentUser, show);
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
  const guesses = await getGuessesForUserForShow(currentUser.id, showId);
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
