import ShowModerator from '@/components/admin/ShowModerator';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { ShowWithVenueAndRun } from '@/models/show.model';
import { getAllShowsWithVenuesAndRuns, getTodaysShow } from '@/services/show.service';
import { getAllSongs } from '@/services/song.service';
import { ResponseStatus, ShowGroupRun } from '@/types/main';
import { organizeShowsByRun } from '@/utils/show.util';
import { Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

interface ShowModeratorPageProps {
  error?: string;
  shows?: ShowGroupRun[];
  todayShow?: ShowWithVenueAndRun;
  allSongs?: Song[];
}

export const getServerSideProps: GetServerSideProps<ShowModeratorPageProps> = async (context) => {
  const session = await getSession(context);
  const currentUserAdmin = session?.user?.admin;
  if (!currentUserAdmin) {
    return { props: { error: 'You must be have admin priviliges to view this page!' } };
  }

  //const showData = await getShowsWithVenueByQuery({}, { date: 'desc' });
  const showData = await getAllShowsWithVenuesAndRuns();
  showData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const shows = JSON.parse(JSON.stringify(showData));
  const showsByRun = organizeShowsByRun(shows);
  showsByRun.forEach((showGroup) => showGroup.shows.sort((a, b) => b.runNight - a.runNight));
  let today = await getTodaysShow();
  const todayShow = today === ResponseStatus.NotFound ? null : JSON.parse(JSON.stringify(today));

  const songs = await getAllSongs();

  return { props: { shows: showsByRun, todayShow, allSongs: songs } };
};

const ShowModeratorPage: React.FC<ShowModeratorPageProps> = ({ shows, todayShow, allSongs, error }) => {
  if (error || !shows || !allSongs) return <ErrorMessage error={error} />;

  return (
    <>
      <Head>
        <title>Admin | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center">
        <ShowModerator shows={shows} todayShow={todayShow} allSongs={allSongs} />
      </div>
    </>
  );
};

export default ShowModeratorPage;
