import Head from 'next/head';
import React from 'react';
import FeedbackContainer from '@/components/feedback/FeedbackContainer';

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
