import BackArrow from '@/components/shared/BackArrow';
import RunBlock from '@/components/shared/RunBlock';
import NotFoundIcon from '@/media/404.svg';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import Link from 'next/link';
import React from 'react';

export interface TodayContainerProps {
  notFound: boolean;
  dateStr: string;
  show: ShowWithVenue | null;
  run: RunWithVenue | null;
}

const NoShowFound = () => {
  const { hexColor } = useThemeContext();
  return (
    <div className="flex flex-col items-center space-y-5 py-5">
      <NotFoundIcon className="mt-2.5" hexColor={hexColor} />
      <p>Sorry! There is no show today.</p>
      <Link href="/shows">View All Shows</Link>
      <a href="https://phish.com/tours/" target="_blank">
        View Upcoming Tours
      </a>
    </div>
  );
};

const ShowFound = ({ show, run }: { show: ShowWithVenue; run: RunWithVenue }) => (
  <>
    <p className="opacity-50 mb-2">Today&apos;s Show:</p>
    <RunBlock run={run} currentShow={show} />
  </>
);

const TodayContainer: React.FC<TodayContainerProps> = ({ notFound, show, run, dateStr }) => {
  const { color } = useThemeContext();

  return (
    <div className="flex flex-col items-center w-full max-w-500 mx-auto p-4">
      <div className="flex justify-start items-center w-full">
        <div className="flex items-center space-x-2">
          <BackArrow
            width={16}
            height={16}
            link="/"
            className="cursor-pointer flex items-center space-x-2"
            svgClass="fill-black dark:fill-white"
          >
            <p className="">Home</p>
          </BackArrow>
        </div>
      </div>
      <div className="flex flex-col w-full items-center pb-4">
        <div className={`flex items-baseline space-x-2 border-b-2 border-${color} pb-2 mb-4`}>
          <p className="text-sm">Today is</p>
          <p className="text-xl font-medium">{dateStr}</p>
        </div>
        {notFound || !show || !run ? <NoShowFound /> : <ShowFound show={show} run={run} />}
      </div>
    </div>
  );
};

export default TodayContainer;
