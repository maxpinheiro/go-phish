import SongLookupContainer from '@/components/data/songs/SongLookupContainer';
import { getAllSongs } from '@/services/song.service';
import { useSongContext } from '@/store/song.store';
import { Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';

interface SongLookupPageProps {
  allSongs: Song[];
}

export const getServerSideProps: GetServerSideProps<SongLookupPageProps> = async () => {
  const allSongs = await getAllSongs();
  return {
    props: { allSongs },
  };
};

const SongLookupPage: React.FC<SongLookupPageProps> = ({ allSongs }) => {
  const { setAllSongs } = useSongContext();

  useEffect(() => {
    if (allSongs) setAllSongs(allSongs);
  }, [allSongs, setAllSongs]);

  return (
    <>
      <Head>
        <title>Song Lookup | Go Phish</title>
      </Head>
      <SongLookupContainer />
    </>
  );
};

export default SongLookupPage;
