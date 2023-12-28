import NotFoundIcon from '@/media/404.svg';
import { ResponseStatus } from '@/types/main';
import { getTodaysShow } from '@/services/show.service';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { getRunWithVenue } from '@/services/run.service';
import moment from 'moment-timezone';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import RunBlock from '@/components/shared/RunBlock';
import BackArrow from '@/components/shared/BackArrow';
import { useThemeContext } from '@/store/theme.store';

interface TodayPageProps {
  error?: string;
  notFound?: boolean;
  dateStr?: string;
  show?: ShowWithVenue;
  run?: RunWithVenue;
}

export const getServerSideProps: GetServerSideProps<TodayPageProps> = async (context) => {
  const timezone = moment.tz.guess(true);
  const today = moment().tz(timezone);
  const dateStr = today.format('MMM Do, YYYY');

  let show = await getTodaysShow();
  if (show === ResponseStatus.NotFound) {
    return {
      props: { notFound: true, dateStr },
    };
  }
  show = JSON.parse(JSON.stringify(show)) as typeof show;
  let run = await getRunWithVenue(show.runId);
  if (run === ResponseStatus.NotFound) {
    return {
      props: { error: "Could not found associated run for today's show." },
    };
  }
  run = JSON.parse(JSON.stringify(run)) as typeof run;
  return { props: { show, run, dateStr } };
};

const Today: React.FC<TodayPageProps> = ({ error, notFound, show, run, dateStr }) => {
  const { color, hexColor } = useThemeContext();
  if (error || !dateStr) return <ErrorMessage error={error} />;

  return (
    <>
      <Head>
        <title>Today | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center">
        <div className="flex justify-start items-center w-full max-w-500 p-4 pb-0">
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
      </div>
      <div className="flex flex-col items-center pb-4">
        <div className={`flex items-baseline space-x-2 border-b-2 border-${color} pb-2 mb-4`}>
          <p className="text-sm">Today is</p>
          <p className="text-xl font-medium">{dateStr}</p>
        </div>
        {notFound || !show || !run ? (
          <div className="flex flex-col items-center space-y-5 py-5">
            <NotFoundIcon className="mt-2.5" hexColor={hexColor} />
            <p>Sorry! There is no show today.</p>
            <Link href="/shows">View All Shows</Link>
            <a href="https://phish.com/tours/" target="_blank">
              View Upcoming Tours
            </a>
          </div>
        ) : (
          <>
            <p className="opacity-50 mb-2">Today&apos; Show:</p>
            <RunBlock run={run} currentShow={show} />
          </>
        )}
      </div>
    </>
  );
};

export default Today;
