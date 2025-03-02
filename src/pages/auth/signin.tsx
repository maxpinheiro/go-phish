import LoginContainer from '@/components/auth/login/LoginContainer';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const SignInPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username;

  if (username) {
    router.push(`/users/${username}`);
    return;
  }

  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <LoginContainer />
    </>
  );
};

export default SignInPage;
