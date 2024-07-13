import FeedbackContainer from '@/components/feedback/FeedbackContainer';
import Head from 'next/head';
import React from 'react';

const FeedbackPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Feedback | Go Phish</title>
      </Head>
      <FeedbackContainer />
    </>
  );
};

export default FeedbackPage;
