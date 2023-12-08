import ErrorMessage from '@/components/shared/ErrorMessage';
import { getAllSongs as getAllPhishNetSongs } from '@/services/phishnet.service';
import { getAllSongs } from '@/services/song.service';
import { PhishNetSong, ResponseStatus } from '@/types/main';
import { setDifference } from '@/utils/utils';
import { Show, Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useState } from 'react';

interface SongCheckerProps {
  error?: string;
  songs?: PhishNetSong[];
  missingSongs?: PhishNetSong[];
}

export const getServerSideProps: GetServerSideProps<SongCheckerProps> = async (context) => {
  const session = await getSession(context);
  const currentUserAdmin = session?.user?.admin;
  if (!currentUserAdmin) {
    return { props: { error: 'You must be have admin priviliges to view this page!' } };
  }

  const songList = await getAllSongs();

  const apiSongs = await getAllPhishNetSongs();
  if (apiSongs === ResponseStatus.UnknownError) {
    return { props: { error: 'Could not find songs.' } };
  }
  apiSongs.sort((a, b) => a.name.localeCompare(b.name));
  const localSongs = new Set(songList.map((s) => s.id));
  const missingSongs = apiSongs.filter((s) => !localSongs.has(s.id));
  // const missingSongs = Array.from(
  //   setDifference(
  //     apiSongs.map((s) => s.name.toLowerCase()),
  //     songList.map((s) => s.name.toLowerCase())
  //   )
  // );

  return { props: { songs: apiSongs, missingSongs } };
};

const SongChecker: React.FC<SongCheckerProps> = ({ songs, missingSongs, error: initError }) => {
  const [error, setError] = useState<string | undefined>(initError);

  if (error || !songs || !missingSongs) return <ErrorMessage error={error} />;

  return (
    <>
      <Head>
        <title>Song Checker | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center">
        <p>Missing Songs:</p>
        {missingSongs.map((s) => (
          <div className="" key={s.id}>
            {s.name} - {s.artist}
          </div>
        ))}
      </div>
    </>
  );
};

export default SongChecker;
