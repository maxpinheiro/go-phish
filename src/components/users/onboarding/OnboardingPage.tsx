import ErrorMessage from '@/components/shared/ErrorMessage';
import OpaqueSkeleton from '@/components/shared/OpaqueSkeleton';
import { defaultAvatar } from '@/models/user.model';
import { AvatarConfig } from '@/types/main';
import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import OnboardingContainer from './OnboardingContainer';
import { OnboardingPageQuery as OnboardingPageQueryType } from './__generated__/OnboardingPageQuery.graphql';

const OnboardingPageQuery = graphql`
  query OnboardingPageQuery {
    me {
      userId
      username
      name
      hometown
      bio
      avatar {
        head
        torso
        background
        type
      }
    }
  }
`;

function useOnboardingPageData() {
  const { me } = useLazyLoadQuery<OnboardingPageQueryType>(OnboardingPageQuery, {});
  if (!me) return null;

  const { userId, username, name, hometown, bio, avatar } = me;
  return { userId, username, name, hometown, bio, avatar };
}

const OnboardingPageWrapper: React.FC = () => {
  const data = useOnboardingPageData();
  if (!data) return <ErrorMessage error="User not found!" />;

  const { userId, username, name, hometown, bio } = data;
  const avatar = JSON.parse(JSON.stringify(data.avatar || defaultAvatar)) as AvatarConfig;

  return (
    <OnboardingContainer
      userId={userId}
      username={username}
      initName={name ?? null}
      initBio={bio ?? null}
      initHometown={hometown ?? null}
      initAvatar={avatar}
    />
  );
};

const OnboardingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-500 mx-auto p-4">
      <Suspense fallback={<OnboardingPageSkeleton />}>
        <OnboardingPageWrapper />
      </Suspense>
    </div>
  );
};

export const OnboardingPageSkeleton = () => (
  <div className="flex flex-col items-center w-full mt-5 px-4">
    <OpaqueSkeleton height={48} borderRadius={6} />
    <div className="h-8" />
    <div className="flex w-full justify-center">
      <OpaqueSkeleton width={100} height={100} borderRadius={8} containerFill={false} />
    </div>
    <div className="h-8" />
    <OpaqueSkeleton height={38} borderRadius={6} />
    <div className="h-10" />
    <OpaqueSkeleton height={38} borderRadius={6} />
    <div className="h-8" />
    <OpaqueSkeleton height={96} borderRadius={6} />
  </div>
);

export default OnboardingPage;
