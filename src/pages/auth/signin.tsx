import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import LoginContainer from '@/components/auth/login/LoginContainer';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  const username = session?.user?.username;

  // redirect to profile if already logged in
  if (username) {
    return {
      redirect: {
        destination: `/users/${username}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const SignInPage: React.FC = () => {
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
