import GuessEditorPageComponent, { GuessEditorSkeleton } from '@/components/guesses/editor/GuessEditorPage';
import { toUpper } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';

const GuessEditorPage: React.FC = () => {
  const router = useRouter();
  const showSlug = router.query.showSlug?.toString() ?? null;
  const showName = showSlug
    ?.split('-')
    ?.map((s) => toUpper(s))
    ?.join(' ');

  return (
    <>
      <Head>
        <title>{`${showName} - Edit Guesses | Go Phish`}</title>
      </Head>
      {showSlug ? <GuessEditorPageComponent showSlug={showSlug} /> : <GuessEditorSkeleton />}
    </>
  );
};

export default GuessEditorPage;
