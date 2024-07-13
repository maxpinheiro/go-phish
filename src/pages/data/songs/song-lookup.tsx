import SongLookupContainer, { SongLookupContainerProps } from '@/components/data/songs/SongLookupContainer';
import { getAllSongs } from '@/services/song.service';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

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
