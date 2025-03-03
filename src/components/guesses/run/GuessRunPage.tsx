import ErrorMessage from '@/components/shared/ErrorMessage';
import OpaqueSkeleton from '@/components/shared/OpaqueSkeleton';
import { buildGuessFromFragment } from '@/graphql/relay/Guess.query';
import { buildRunWithVenueFromFragment } from '@/graphql/relay/Run.query';
import { buildShowFromFragment, buildShowWithVenueFromFragment } from '@/graphql/relay/Show.query';
import { buildUserFromFragment } from '@/graphql/relay/User.query';
import { organizeGuessesWithUsers } from '@/utils/guess.util';
import Head from 'next/head';
import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import GuessRunContainer from './GuessRunContainer';
import GuessRunNavbar from './GuessRunNavbar';
import { GuessRunPageQuery as GuessRunPageQueryType } from './__generated__/GuessRunPageQuery.graphql';

interface GuessRunPageProps {
  runSlug: string;
}

const GuessRunPageQuery = graphql`
  query GuessRunPageQuery($runSlug: String!) {
    runBySlug(slug: $runSlug) {
      ...RunWithVenueFragment
      shows {
        ...ShowWithVenueFragment
      }
      guesses {
        ...GuessFragment
        user {
          ...UserFragment
        }
        show {
          ...ShowFragment
        }
      }
    }
  }
`;

function useGuessRunPageData(runSlug: string) {
  const data = useLazyLoadQuery<GuessRunPageQueryType>(GuessRunPageQuery, { runSlug });
  const { runBySlug } = data;

  let run = runBySlug ? buildRunWithVenueFromFragment(runBySlug) : null;
  if (!run || !runBySlug) {
    return { run, shows: [], guesses: [] };
  }

  const shows = runBySlug.shows.map(buildShowWithVenueFromFragment);
  const guesses = runBySlug.guesses.map((g) => ({
    ...buildGuessFromFragment(g),
    user: buildUserFromFragment(g.user),
    show: buildShowFromFragment(g.show),
  }));

  const organizedGuesses = guesses ? organizeGuessesWithUsers(guesses) : null;

  return { run, shows, organizedGuesses };
}

const GuessRunPageWrapper: React.FC<GuessRunPageProps> = ({ runSlug }) => {
  const { run, shows, organizedGuesses } = useGuessRunPageData(runSlug);

  if (!run || !shows || !organizedGuesses) return <ErrorMessage error="Run not found!" />;

  return (
    <>
      <Head>
        <title>{`${run.name} - Guesses | Go Phish`}</title>
      </Head>
      <GuessRunContainer run={run} shows={shows} guesses={organizedGuesses} />
    </>
  );
};

const GuessRunPage: React.FC<GuessRunPageProps> = ({ runSlug }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <GuessRunNavbar />
      <Suspense fallback={<GuessRunSkeleton />}>
        <GuessRunPageWrapper runSlug={runSlug} />
      </Suspense>
    </div>
  );
};

export const GuessRunSkeleton = () => (
  <div className="flex flex-col items-center w-full pt-4">
    <OpaqueSkeleton opacityClass="opacity-10" width="25%" height={102} borderRadius={8} className="min-w-56" />
    <div className="h-4" />
    <OpaqueSkeleton
      width="60%"
      height={42}
      count={6}
      borderRadius={8}
      className="min-w-72"
      containerClassName="space-y-4"
    />
  </div>
);

export default GuessRunPage;
