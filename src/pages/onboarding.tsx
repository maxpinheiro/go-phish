import Container, { OnboardingContainerProps } from '@/components/users/onboarding/OnboardingContainer';
import { getUserById } from '@/services/user.service';
import { AvatarConfig } from '@/types/main';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

export const getServerSideProps: GetServerSideProps<OnboardingContainerProps> = async (context) => {
  const session = await getSession(context);
  const userId = session?.user?.id;
  const username = session?.user?.username;

  if (!userId || !username) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const user = await getUserById(userId);
  if (user === ResponseStatus.NotFound) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      userId,
      username,
      initName: user.name || '',
      initHometown: user.hometown || '',
      initBio: user.bio,
      initAvatar: JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig,
    },
  };
};

const OnboardingPage: React.FC<OnboardingContainerProps> = (props) => {
  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <Container {...props} />
    </>
  );
};

export default OnboardingPage;
