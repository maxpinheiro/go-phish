import GuessRunPageComponent from '@/components/guesses/run/GuessRunPage';
import { toUpper } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const GuessRunPage: React.FC = () => {
  const router = useRouter();
  const runSlug = router.query.runSlug?.toString() ?? null;
  const runName = runSlug
    ?.split('-')
    ?.map((s) => toUpper(s))
    ?.join(' ');

  return (
    <>
      <Head>
        <title>{`${runName} - Guesses | Go Phish`}</title>
      </Head>
      {runSlug && <GuessRunPageComponent runSlug={runSlug} />}
    </>
  );
};

export default GuessRunPage;
