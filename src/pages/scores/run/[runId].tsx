import ErrorMessage from '@/components/shared/ErrorMessage';
import { ResponseStatus } from '@/types/main';
import { getGuessesForRun } from '@/services/guess.service';
import { getRunWithVenue } from '@/services/run.service';
import { getShowsForRunWithVenue } from '@/services/show.service';
import { getUsersByIds } from '@/services/user.service';
import { rankScoresByUser } from '@/utils/guess.util';
import { organizeArrayByField, parseObj } from '@/utils/utils';
import { Guess } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import RunScoreContainer, { RunScoreContainerProps } from '@/components/scores/run/RunScoreContainer';

type RunScorePageProps = Partial<RunScoreContainerProps> & {
  error?: string;
};

export const getServerSideProps: GetServerSideProps<RunScorePageProps> = async (context) => {
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
  guesses = JSON.parse(JSON.stringify(guesses)) as typeof guesses;
  const guessesByUser = organizeArrayByField<Guess>(guesses, 'userId');
  const userIds = Object.keys(guessesByUser).map((user) => parseInt(user));
  let users = await getUsersByIds(userIds);
  if (users === ResponseStatus.NotFound) {
    return {
      props: { error: 'Run not found.' },
    };
  }
  users = JSON.parse(JSON.stringify(users, parseObj)) as typeof users;
  const rankedUserScores = rankScoresByUser(guessesByUser, users);
  return {
    props: { run, shows, rankedUserScores },
  };
};

const RunScorePage: React.FC<RunScorePageProps> = ({ run, shows, rankedUserScores, error }) => {
  if (error || !run || !shows || !rankedUserScores) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>{run.name} - Leaderboard | Go Phish</title>
      </Head>
      <RunScoreContainer run={run} shows={shows} rankedUserScores={rankedUserScores} />
    </>
  );
};

export default RunScorePage;
