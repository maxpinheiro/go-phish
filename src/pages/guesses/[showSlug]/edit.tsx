import GuessEditorPageComponent, { GuessEditorSkeleton } from '@/components/guesses/editor/GuessEditorPage';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { toUpper } from 'lodash';
import { useSession } from 'next-auth/react';
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

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  if (!currentUserId) return <ErrorMessage error="You must be logged in to view this page." />;

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
