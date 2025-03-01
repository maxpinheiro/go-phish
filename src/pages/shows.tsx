import ShowsPageComponent from '@/components/shows/ShowsPage';
import Head from 'next/head';
import React from 'react';

const ShowsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Shows | Go Phish</title>
      </Head>
      <ShowsPageComponent />
    </>
  );
};

export default ShowsPage;
