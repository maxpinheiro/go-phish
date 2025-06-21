import OpaqueSkeleton from '@/components/shared/OpaqueSkeleton';
import { useRunWithVenueFragment } from '@/graphql/relay/Run.query';
import { useShowWithVenueFragment } from '@/graphql/relay/Show.query';
import moment from 'moment-timezone';
import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import TodayContainer from './TodayContainer';
import { TodayPageQuery as TodayPageQueryType } from './__generated__/TodayPageQuery.graphql';

const TodayPageQuery = graphql`
  query TodayPageQuery($todayStr: String!) {
    showForDate(dateStr: $todayStr) {
      ...ShowWithVenueFragment
      run {
        ...RunWithVenueFragment
      }
    }
  }
`;

function useTodayPageData(todayStr: string) {
  const { showForDate } = useLazyLoadQuery<TodayPageQueryType>(TodayPageQuery, { todayStr });

  const show = showForDate ? useShowWithVenueFragment(showForDate) : null;
  const run = showForDate ? useRunWithVenueFragment(showForDate.run) : null;

  return { show, run };
}

const TodayPageWrapper = () => {
  const today = moment().tz(moment.tz.guess(true));
  const todayStr = today.format('YYYY-MM-DD');
  const formattedDate = today.format('MMM Do, YYYY');

  const { show, run } = useTodayPageData(todayStr);

  return <TodayContainer notFound={show === null} dateStr={formattedDate} show={show} run={run} />;
};

const TodayPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <Suspense fallback={<TodayPageSkeleton />}>
        <TodayPageWrapper />
      </Suspense>
    </div>
  );
};

const TodayPageSkeleton = () => (
  <div className="flex flex-col items-center w-full p-4">
    <div className="flex w-full justify-center mt-4">
      <OpaqueSkeleton width={220} height={48} borderRadius={8} containerFill={false} />
    </div>
    <div className="h-8" />
    <div className="flex w-full justify-center">
      <OpaqueSkeleton opacityClass="opacity-10" width={480} height={260} borderRadius={12} containerFill={false} />
    </div>
  </div>
);

export default TodayPage;
