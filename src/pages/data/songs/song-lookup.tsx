import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getAllSongs } from '@/services/song.service';
import SongLookupContainer, { SongLookupContainerProps } from '@/components/data/songs/SongLookupContainer';

export const getServerSideProps: GetServerSideProps<SongLookupContainerProps> = async () => {
  const allSongs = await getAllSongs();
  return {
    props: { allSongs },
  };
};

const SongLookupPage: React.FC<SongLookupContainerProps> = ({ allSongs }) => {
  return (
    <>
      <Head>
        <title>Song Lookup | Go Phish</title>
      </Head>
      <SongLookupContainer allSongs={allSongs} />
    </>
  );
};

export default SongLookupPage;
