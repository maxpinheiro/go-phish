import { ResponseStatus } from '@/types/main';
import { getTodaysShow } from '@/services/show.service';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { getRunWithVenue } from '@/services/run.service';
import moment from 'moment-timezone';
import ErrorMessage from '@/components/shared/ErrorMessage';
import TodayContainer, { TodayContainerProps } from '@/components/shows/TodayContainer';

interface TodayPageProps extends TodayContainerProps {
  error?: string;
}

export const getServerSideProps: GetServerSideProps<TodayPageProps> = async (context) => {
  const timezone = moment.tz.guess(true);
  const today = moment().tz(timezone);
  const dateStr = today.format('MMM Do, YYYY');
  let notFound = true;

  let show = await getTodaysShow();
  if (show === ResponseStatus.NotFound) {
    return {
      props: { notFound, dateStr },
    };
  }
  notFound = false;
  show = JSON.parse(JSON.stringify(show)) as typeof show;
  let run = await getRunWithVenue(show.runId);
  if (run === ResponseStatus.NotFound) {
    return {
      props: { error: "Could not found associated run for today's show.", notFound, dateStr },
    };
  }
  run = JSON.parse(JSON.stringify(run)) as typeof run;
  return { props: { show, run, dateStr, notFound } };
};

const TodayPage: React.FC<TodayPageProps> = ({ error, ...props }) => {
  return (
    <>
      <Head>
        <title>Today | Go Phish</title>
      </Head>
      {error ? <ErrorMessage error={error} /> : <TodayContainer {...props} />}
    </>
  );
};

export default TodayPage;
