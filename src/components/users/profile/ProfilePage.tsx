import ErrorMessage from '@/components/shared/ErrorMessage';
import OpaqueSkeleton from '@/components/shared/OpaqueSkeleton';
import { buildGuessWithRunFromFragment } from '@/graphql/relay/Guess.query';
import { buildUserFromFragment } from '@/graphql/relay/User.query';
import { GuessWithRun } from '@/models/guess.model';
import { organizeRunRecord } from '@/utils/guess.util';
import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import ProfileContainer from './ProfileContainer';
import { ProfilePageQuery as ProfilePageQueryType } from './__generated__/ProfilePageQuery.graphql';

interface ProfilePageProps {
  username: string;
}

const ProfilePageQuery = graphql`
  query ProfilePageQuery($username: String!) {
    userByName(username: $username) {
      ...UserFragment
      guesses(completed: true) {
        ...GuessWithRunFragment
      }
    }
  }
`;

function useProfilePageData(username: string) {
  const data = useLazyLoadQuery<ProfilePageQueryType>(ProfilePageQuery, { username });
  const { userByName } = data;
  const user = userByName ? buildUserFromFragment(userByName) : null;
  const guessesWithRun: GuessWithRun[] = userByName?.guesses?.map(buildGuessWithRunFromFragment) || [];

  const runRecord = organizeRunRecord(guessesWithRun);

  return { user, runRecord };
}

const ProfilePageWrapper: React.FC<ProfilePageProps> = ({ username }) => {
  const { user, runRecord } = useProfilePageData(username);

  if (!user) return <ErrorMessage error="User not found!" />;

  return <ProfileContainer user={user} runRecord={runRecord} />;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ username }) => {
  return (
    <div className="flex flex-col w-full max-w-500 mx-auto p-4">
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePageWrapper username={username} />
      </Suspense>
    </div>
  );
};

export const ProfilePageSkeleton = () => (
  <div className="flex flex-col items-center w-full mt-4 px-4">
    <OpaqueSkeleton height={48} borderRadius={6} />
    <div className="h-8" />
    <OpaqueSkeleton height={32} count={2} borderRadius={6} containerClassName="space-y-4" />
    <div className="h-8" />
    <OpaqueSkeleton height={32} count={2} borderRadius={6} containerClassName="space-y-4" />
    <div className="h-8" />
    <OpaqueSkeleton height={32} count={2} borderRadius={6} containerClassName="space-y-4" />
  </div>
);

export default ProfilePage;
