import ErrorMessage from '@/components/shared/ErrorMessage';
import ProfileContainer from '@/components/users/profile/ProfileContainer';
import { getScoresForUser } from '@/services/guess.service';
import { getRunsByIds } from '@/services/run.service';
import { getUserByUsername } from '@/services/user.service';
import { ResponseStatus } from '@/types/main';
import { OrganizedRunItem, organizeRunRecord } from '@/utils/guess.util';
import { organizeArrayByField } from '@/utils/utils';
import { Guess, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

interface ProfilePageProps {
  user?: User;
  scoreRecord?: OrganizedRunItem[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context) => {
  const username = context.params?.username?.toString();
  if (!username) {
    return {
      props: { error: 'Missing/invalid username.' },
    };
  }
  let user = await getUserByUsername(username);
  if (user === ResponseStatus.NotFound) {
    return {
      props: { error: 'User not found.' },
    };
  }
  user = JSON.parse(JSON.stringify(user)) as typeof user;
  const scores = await getScoresForUser(user.id);
  if (scores === ResponseStatus.NotFound) {
    return {
      props: { error: 'Scores not found.' },
    };
  }
  const scoresByRun = organizeArrayByField<Guess>(scores, 'runId');
  const runIds = Object.keys(scoresByRun).map((id) => parseInt(id));
  const runs = await getRunsByIds(runIds);
  if (runs === ResponseStatus.NotFound) {
    return {
      props: { error: 'Runs not found.' },
    };
  }
  const runsOrganized = organizeRunRecord(scoresByRun, JSON.parse(JSON.stringify(runs)));
  return {
    props: { user, scoreRecord: runsOrganized },
  };
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, scoreRecord, error }) => {
  if (error || !user || !scoreRecord) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>{user.username} | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center">
        <ProfileContainer user={user} runRecord={scoreRecord} />
      </div>
    </>
  );
};

export default ProfilePage;
