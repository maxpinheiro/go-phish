import { useShowWithVenueAndRunFragment } from '@/graphql/relay/Show.query';
import { ShowGroupRun, ShowGroupVenue, ShowGroupYear } from '@/types/main';
import { organizeShowsByRun, organizeShowsByVenue, organizeShowsByYear } from '@/utils/show.util';
import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import OpaqueSkeleton from '../shared/OpaqueSkeleton';
import ShowsContainer from './ShowsContainer';
import { ShowsPageQuery as ShowsPageQueryType } from './__generated__/ShowsPageQuery.graphql';

const ShowsPageQuery = graphql`
  query ShowsPageQuery {
    allShows {
      ...ShowWithVenueAndRunFragment
    }
  }
`;

function useShowsPageData() {
  const { allShows } = useLazyLoadQuery<ShowsPageQueryType>(ShowsPageQuery, {});
  const shows = allShows.map(useShowWithVenueAndRunFragment);

  const showsByRun: ShowGroupRun[] = organizeShowsByRun(shows);
  const showsByYear: ShowGroupYear[] = organizeShowsByYear(shows);
  const showsByVenue: ShowGroupVenue[] = organizeShowsByVenue(shows);

  return { showsByRun, showsByYear, showsByVenue };
}

const ShowsPageWrapper = () => {
  const { showsByRun, showsByYear, showsByVenue } = useShowsPageData();

  return <ShowsContainer showsByRun={showsByRun} showsByYear={showsByYear} showsByVenue={showsByVenue} />;
};

const ShowsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <p className="text-4xl text-center my-4">Shows</p>
      <Suspense fallback={<ShowsPageSkeleton />}>
        <ShowsPageWrapper />
      </Suspense>
    </div>
  );
};

const ShowsPageSkeleton = () => (
  <div className="flex flex-col items-center w-full mt-4">
    <OpaqueSkeleton height={58} count={6} borderRadius={8} containerClassName="space-y-4" />
  </div>
);

export default ShowsPage;
