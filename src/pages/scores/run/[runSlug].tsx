import RunScorePageComponent from '@/components/scores/run/RunScorePage';
import { toUpper } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const RunScorePage: React.FC = () => {
  const router = useRouter();
  const runSlug = router.query.runSlug?.toString() ?? null;
  const runName = runSlug
    ?.split('-')
    ?.map((s) => toUpper(s))
    ?.join(' ');

  return (
    <>
      <Head>
        <title>{`${runName} - Leaderboard | Go Phish`}</title>
      </Head>
      {runSlug && <RunScorePageComponent runSlug={runSlug} />}
    </>
  );
};

export default RunScorePage;
