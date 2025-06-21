import ErrorMessage from '@/components/shared/ErrorMessage';
import OpaqueSkeleton from '@/components/shared/OpaqueSkeleton';
import { useGuessFragment } from '@/graphql/relay/Guess.query';
import { useRunWithVenueFragment } from '@/graphql/relay/Run.query';
import { useShowWithVenueFragment } from '@/graphql/relay/Show.query';
import { useSongFragment } from '@/graphql/relay/Song.query';
import { buildRunWithISODates } from '@/models/run.model';
import { buildShowWithISODates, ShowIdAndRunNight } from '@/models/show.model';
import { setShow, ShowWithRunWithISODates } from '@/store/guessEditor.store';
import { useSongContext } from '@/store/song.store';
import Head from 'next/head';
import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { graphql, useLazyLoadQuery } from 'react-relay';
import superjson from 'superjson';
import { GuessEditorPageQuery as GuessEditorPageQueryType } from './__generated__/GuessEditorPageQuery.graphql';
import GuessEditorContainer from './GuessEditorContainer';
import GuessEditorNavbar from './GuessEditorNavbar';

export interface GuessEditorPageProps {
  showSlug: string;
}

const GuessEditorPageQuery = graphql`
  query GuessEditorPageQuery($showSlug: String!) {
    showBySlug(slug: $showSlug) {
      ...ShowWithVenueFragment
      run {
        ...RunWithVenueFragment
        shows {
          showId
          runNight
        }
      }
      myGuesses {
        ...GuessFragment
      }
      guessEditForbiddenReason
    }
    allSongs {
      ...SongFragment
    }
  }
`;

function useGuessEditorPageData(showSlug: string) {
  const data = useLazyLoadQuery<GuessEditorPageQueryType>(GuessEditorPageQuery, { showSlug });
  const { showBySlug, allSongs } = data;

  let show = showBySlug ? useShowWithVenueFragment(showBySlug) : null;
  show = superjson.parse<typeof show>(superjson.stringify(show));
  let run = showBySlug ? useRunWithVenueFragment(showBySlug.run) : null;
  run = superjson.parse<typeof run>(superjson.stringify(run));

  const runShows: ShowIdAndRunNight[] =
    showBySlug?.run?.shows.map(({ showId, runNight }) => ({ id: showId, runNight })) || [];

  const myGuesses = showBySlug?.myGuesses?.map(useGuessFragment) || [];
  const guessEditForbiddenReason = showBySlug?.guessEditForbiddenReason ?? null;

  const songs = allSongs.map(useSongFragment);
  return { show, run, runShows, myGuesses, guessEditForbiddenReason, songs };
}

const GuessEditorWrapper: React.FC<GuessEditorPageProps> = ({ showSlug }) => {
  const dispatch = useDispatch();
  const { setAllSongs } = useSongContext();
  const { show, run, runShows, myGuesses, guessEditForbiddenReason, songs } = useGuessEditorPageData(showSlug);

  // populate data within contexts/reducers
  useEffect(() => {
    if (show && run) {
      const showData: ShowWithRunWithISODates = {
        ...buildShowWithISODates(show),
        run: buildRunWithISODates(run),
      };
      dispatch(setShow(showData));
    }
    if (songs) setAllSongs(songs);
  }, [show, run, songs]);

  if (!show || !run) return <ErrorMessage error="Show not found!" />;

  return (
    <>
      <Head>
        <title>{`${run.name}, Night ${show.runNight} - Edit Guesses | Go Phish`}</title>
      </Head>
      <GuessEditorContainer
        run={run}
        show={show}
        runShows={runShows}
        currentGuesses={myGuesses}
        forbiddenReason={guessEditForbiddenReason}
      />
    </>
  );
};

const GuessEditorPage: React.FC<GuessEditorPageProps> = ({ showSlug }) => {
  return (
    <div id="guess-editor-page" className="flex flex-col items-center w-full p-4">
      <GuessEditorNavbar />
      <Suspense fallback={<GuessEditorSkeleton />}>
        <GuessEditorWrapper showSlug={showSlug} />
      </Suspense>
    </div>
  );
};

export const GuessEditorSkeleton = () => (
  <div className="flex flex-col items-center w-full pt-5">
    <OpaqueSkeleton width="25%" height={30} borderRadius={6} className="min-w-56" />
    <div className="h-2" />
    <OpaqueSkeleton width="20%" height={18} borderRadius={6} className="min-w-44" />
    <div className="h-4" />
    <OpaqueSkeleton height={34} count={10} borderRadius={8} containerClassName="space-y-4 px-8" />
  </div>
);

export default GuessEditorPage;
