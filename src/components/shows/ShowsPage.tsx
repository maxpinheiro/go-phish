import { buildShowWithVenueAndRunFromFragment } from '@/graphql/relay/Show.query';
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
  const shows = allShows.map(buildShowWithVenueAndRunFromFragment);

  const showsByRun = organizeShowsByRun(shows);
  const showsByYear = organizeShowsByYear(shows);
  const showsByVenue = organizeShowsByVenue(shows);

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
      {/* <div className="flex w-full">
        <div className="flex w-1/2 border">
          <ShowsPageSkeleton />
        </div>
        <div className="flex w-1/2 border">
          <Suspense fallback={<ShowsPageSkeleton />}>
            <ShowsPageWrapper />
          </Suspense>
        </div>
      </div> */}
      <Suspense fallback={<ShowsPageSkeleton />}>
        <ShowsPageWrapper />
      </Suspense>
    </div>
  );
};

const ShowsPageSkeleton = () => (
  <div className="flex flex-col items-center w-full mt-4">
    {/* <OpaqueSkeleton width={220} height={48} borderRadius={8} /> */}
    <OpaqueSkeleton height={58} count={6} borderRadius={8} containerClassName="space-y-4" />
  </div>
);

export default ShowsPage;
