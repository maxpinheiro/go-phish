import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { ResponseStatus } from '@/types/main';
import { getGuessesForRun } from '@/services/guess.service';
import { getRunWithVenue } from '@/services/run.service';
import { getShowsForRunWithVenue } from '@/services/show.service';
import { getUsersByIds } from '@/services/user.service';
import { organizeGuessesByUser } from '@/utils/guess.util';
import { organizeArrayByField, parseObj } from '@/utils/utils';
import { Guess } from '@prisma/client';
import GuessRunContainer, { GuessRunContainerProps } from '@/components/guesses/run/GuessRunContainer';

type GuessRunPageProps = Partial<GuessRunContainerProps> & {
  error?: string;
};

export const getServerSideProps: GetServerSideProps<GuessRunPageProps> = async (context) => {
  const runId = parseInt(context.params?.runId?.toString() || '');
  if (isNaN(runId)) {
    return {
      props: { error: 'Missing/invalid run id.' },
    };
  }
  let run = await getRunWithVenue(runId);
  if (run === ResponseStatus.NotFound) {
    return {
      props: { error: 'Run not found.' },
    };
  }
  run = JSON.parse(JSON.stringify(run)) as typeof run;
  let shows = await getShowsForRunWithVenue(runId);
  if (shows === ResponseStatus.NotFound) {
    return {
      props: { error: 'Shows not found.' },
    };
  }
  shows = JSON.parse(JSON.stringify(shows)) as typeof shows;
  let guesses = await getGuessesForRun(runId);
  if (guesses === ResponseStatus.NotFound) {
    return {
      props: { error: 'Guesses not found.' },
    };
  }
  guesses = JSON.parse(JSON.stringify(guesses, parseObj)) as typeof guesses;
  const guessesByUser = organizeArrayByField<Guess>(guesses, 'userId');
  const userIds = Object.keys(guessesByUser).map((user) => parseInt(user));
  let users = await getUsersByIds(userIds);
  if (users === ResponseStatus.NotFound) {
    return {
      props: { error: 'Users not found.' },
    };
  }
  users = JSON.parse(JSON.stringify(users, parseObj)) as typeof users;
  const organizedGuesses = organizeGuessesByUser(guessesByUser, users);
  return {
    props: { run, shows, guesses: organizedGuesses },
  };
};

const GuessRunPage: React.FC<GuessRunPageProps> = ({ run, shows, guesses, error }) => {
  if (error || !run || !shows || !guesses) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>{run.name} - Guesses | Go Phish</title>
      </Head>
      <GuessRunContainer run={run} shows={shows} guesses={guesses} />
    </>
  );
};

export default GuessRunPage;
