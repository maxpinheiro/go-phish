import ShowModerator from '@/components/admin/shows/ShowModeratorPage';
import ErrorMessage from '@/components/shared/ErrorMessage';
import moment from 'moment-timezone';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

const ShowModeratorPage: React.FC = () => {
  const { data: session } = useSession();
  const currentUserAdmin = session?.user?.admin;

  if (!currentUserAdmin) {
    return <ErrorMessage error={'You must be have admin priviliges to view this page!'} />;
  }

  const today = moment().tz(moment.tz.guess(true));
  const todayStr = today.format('YYYY-MM-DD');

  return (
    <>
      <Head>
        <title>Admin | Go Phish</title>
      </Head>
      <ShowModerator todayStr={todayStr} />
    </>
  );
};

export default ShowModeratorPage;
