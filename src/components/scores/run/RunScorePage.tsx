import ErrorMessage from '@/components/shared/ErrorMessage';
import OpaqueSkeleton from '@/components/shared/OpaqueSkeleton';
import { useGuessesWithShowAndUser } from '@/graphql/relay/Guess.query';
import { useRunWithVenueFragment } from '@/graphql/relay/Run.query';
import { useShowWithVenueFragment } from '@/graphql/relay/Show.query';
import { ShowWithVenue } from '@/models/show.model';
import { rankScoresWithUsers } from '@/utils/guess.util';
import Head from 'next/head';
import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { RunScorePageQuery as RunScorePageQueryType } from './__generated__/RunScorePageQuery.graphql';
import RunScoreContainer from './RunScoreContainer';
import RunScoreNavbar from './RunScoreNavbar';

interface RunScorePageProps {
  runSlug: string;
}

const RunScorePageQuery = graphql`
  query RunScorePageQuery($runSlug: String!) {
    runBySlug(slug: $runSlug) {
      ...RunWithVenueFragment
      shows {
        ...ShowWithVenueFragment
      }
      guesses(completed: true) {
        ...GuessesWithShowAndUserFragment
      }
    }
  }
`;

function useRunScorePageData(runSlug: string) {
  const data = useLazyLoadQuery<RunScorePageQueryType>(RunScorePageQuery, { runSlug });
  const { runBySlug } = data;

  let run = useRunWithVenueFragment(runBySlug || null);

  const shows = (runBySlug?.shows ?? []).map(useShowWithVenueFragment) as ShowWithVenue[];

  const guesses = useGuessesWithShowAndUser(runBySlug?.guesses || null);

  const rankedUserScores = guesses ? rankScoresWithUsers(guesses) : null;

  return { run, shows, rankedUserScores };
}

const RunScorePageWrapper: React.FC<RunScorePageProps> = ({ runSlug }) => {
  const { run, shows, rankedUserScores } = useRunScorePageData(runSlug);

  if (!run || !shows || !rankedUserScores) return <ErrorMessage error="Run not found!" />;

  return (
    <>
      <Head>
        <title>{`${run.name} - Leaderboard | Go Phish`}</title>
      </Head>
      <RunScoreContainer run={run} shows={shows} rankedUserScores={rankedUserScores} />
    </>
  );
};

const RunScorePage: React.FC<RunScorePageProps> = ({ runSlug }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <RunScoreNavbar />
      <Suspense fallback={<RunScoreSkeleton />}>
        <RunScorePageWrapper runSlug={runSlug} />
      </Suspense>
    </div>
  );
};

export const RunScoreSkeleton = () => (
  <div className="flex flex-col items-center w-full max-w-500 mx-auto p-4">
    <div className="flex w-1/4 min-w-56 mx-auto">
      <OpaqueSkeleton opacityClass="opacity-10" height={102} borderRadius={8} />
    </div>
    <div className="h-4" />
    <OpaqueSkeleton
      height={42}
      count={6}
      borderRadius={8}
      className="min-w-72 mx-auto"
      containerClassName="space-y-4"
    />
  </div>
);

export default RunScorePage;
