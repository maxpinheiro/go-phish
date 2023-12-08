import { scoreGuessesForShow } from '@/client/guess.client';
import SetlistBuilder from '@/components/admin/SetlistBuilder';
import ShowSelector from '@/components/admin/ShowSelector';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { ShowWithVenue } from '@/models/show.model';
import { getAllShows, getShowsByQuery, getShowsWithVenueByQuery, getTodaysShow } from '@/services/show.service';
import { getAllSongs } from '@/services/song.service';
import { ResponseStatus, SetlistSong } from '@/types/main';
import { dateToDateString } from '@/utils/date.util';
import { Show, Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';

interface AdminPageProps {
  error?: string;
  shows?: ShowWithVenue[];
  todayShow?: ShowWithVenue;
  allSongs?: Song[];
}

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async (context) => {
  const session = await getSession(context);
  const currentUserAdmin = session?.user?.admin;
  if (!currentUserAdmin) {
    return { props: { error: 'You must be have admin priviliges to view this page!' } };
  }

  const showData = await getShowsWithVenueByQuery({}, { date: 'desc' });
  const shows = JSON.parse(JSON.stringify(showData));
  let today = await getTodaysShow();
  const todayShow = today === ResponseStatus.NotFound ? null : JSON.parse(JSON.stringify(today));

  const songs = await getAllSongs();

  return { props: { shows, todayShow, allSongs: songs } };
};

const Admin: React.FC<AdminPageProps> = ({ shows, todayShow, allSongs, error: initError }) => {
  const [selectedShow, selectShow] = useState<ShowWithVenue | null>(null);
  const [status, setStatus] = useState<'select' | 'build' | 'loading' | 'success' | 'error'>('select');
  const [error, setError] = useState<string | undefined>(initError);

  const submitSongs = async (songs: SetlistSong[]) => {
    if (!selectedShow) return;
    setStatus('loading');
    const res = await scoreGuessesForShow(selectedShow.id, songs);
    if (res === ResponseStatus.Success) {
      setStatus('success');
    } else {
      setError('an unknown error occurred while scoring guesses.');
      setStatus('error');
    }
  };

  if (error || !shows || !allSongs) return <ErrorMessage error={error} />;

  return (
    <>
      <Head>
        <title>Admin | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center">
        {status === 'select' && (
          <ShowSelector
            shows={shows}
            todayShow={todayShow}
            selectShow={(show) => {
              selectShow(show);
              setStatus('build');
            }}
          />
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center my-4">
            <p className="my-4">Successfully scored guesses.</p>
            <Link href={`/scores/run/${selectedShow?.runId}?night=${selectedShow?.runNight || ''}`}>
              View Leaderboard
            </Link>
          </div>
        )}
        {status === 'build' && selectedShow && (
          <>
            <div className="flex items-center mt-4">
              <p>
                {dateToDateString(selectedShow.timestamp)} - {selectedShow.venue.name}
              </p>
            </div>
            <div
              className="my-2.5 cursor-pointer opacity-50"
              onClick={() => {
                selectShow(null);
                setStatus('build');
              }}
            >
              Choose Different Show
            </div>
            <SetlistBuilder show={selectedShow} submit={submitSongs} allSongs={allSongs} />
          </>
        )}
      </div>
    </>
  );
};

export default Admin;
