import ErrorMessage from '@/components/shared/ErrorMessage';
import ShowsContainer from '@/components/shows/ShowsContainer';
import { getAllShowsWithVenuesAndRuns } from '@/services/show.service';
import { ShowGroupRun, ShowGroupVenue, ShowGroupYear } from '@/types/main';
import { organizeShowsByRun, organizeShowsByVenue, organizeShowsByYear } from '@/utils/show.util';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

interface ShowsProps {
  showsByRun: ShowGroupRun[];
  showsByYear: ShowGroupYear[];
  showsByVenue: ShowGroupVenue[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps<ShowsProps> = async (context) => {
  let shows = await getAllShowsWithVenuesAndRuns();

  shows = JSON.parse(JSON.stringify(shows)) as typeof shows;

  const showsByRun = organizeShowsByRun(shows);
  const showsByYear = organizeShowsByYear(shows);
  const showsByVenue = organizeShowsByVenue(shows);

  return {
    props: { showsByRun, showsByYear, showsByVenue },
  };
};

const ShowsPage: React.FC<ShowsProps> = ({ showsByRun, showsByYear, showsByVenue, error }) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>Shows | Go Phish</title>
      </Head>
      <ShowsContainer showsByRun={showsByRun} showsByYear={showsByYear} showsByVenue={showsByVenue} />
    </>
  );
};

export default ShowsPage;
