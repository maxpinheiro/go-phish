import { buildShowWithVenueAndRunFromFragment } from '@/graphql/relay/Show.query';
import { buildSongFromFragment } from '@/graphql/relay/Song.query';
import { useSongContext } from '@/store/song.store';
import { organizeShowsByRun } from '@/utils/show.util';
import React, { Suspense, useEffect } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import ShowModerator, { ShowModeratorSkeleton } from './ShowModerator';
import ShowModeratorNavbar from './ShowModeratorNavbar';
import { ShowModeratorPageQuery as ShowModeratorPageQueryType } from './__generated__/ShowModeratorPageQuery.graphql';

interface ShowModeratorPageProps {
  todayStr: string;
}

const ShowModeratorPageQuery = graphql`
  query ShowModeratorPageQuery($todayStr: String!) {
    allShows {
      ...ShowWithVenueAndRunFragment
    }
    showForDate(dateStr: $todayStr) {
      ...ShowWithVenueAndRunFragment
    }
    allSongs {
      ...SongFragment
    }
  }
`;

function useShowModeratorPageData(todayStr: string) {
  const data = useLazyLoadQuery<ShowModeratorPageQueryType>(ShowModeratorPageQuery, { todayStr });

  const { allShows, showForDate, allSongs } = data;
  const shows = allShows.map(buildShowWithVenueAndRunFromFragment);
  shows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const showsByRun = organizeShowsByRun(shows);
  showsByRun.forEach((showGroup) => showGroup.shows.sort((a, b) => b.runNight - a.runNight));

  const todayShow = showForDate ? buildShowWithVenueAndRunFromFragment(showForDate) : undefined;
  const songs = allSongs.map(buildSongFromFragment);

  return { showsByRun, todayShow, songs };
}

const ShowModeratorWrapper: React.FC<ShowModeratorPageProps> = ({ todayStr }) => {
  const { setAllSongs } = useSongContext();
  const { showsByRun, todayShow, songs } = useShowModeratorPageData(todayStr);

  useEffect(() => {
    if (songs) setAllSongs(songs);
  }, [songs]);

  return <ShowModerator shows={showsByRun} todayShow={todayShow} />;
};

const ShowModeratorPage: React.FC<ShowModeratorPageProps> = ({ todayStr }) => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-4 mx-auto">
      <ShowModeratorNavbar />
      <p className="text-title-regular text-center my-2">Moderate Shows</p>
      <Suspense fallback={<ShowModeratorSkeleton />}>
        <ShowModeratorWrapper todayStr={todayStr} />
      </Suspense>
    </div>
  );
};

export default ShowModeratorPage;
