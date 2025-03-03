import TodayPageComponent from '@/components/shows/today/TodayPage';
import Head from 'next/head';
import React from 'react';

const TodayPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Today | Go Phish</title>
      </Head>
      <TodayPageComponent />
    </>
  );
};

export default TodayPage;
