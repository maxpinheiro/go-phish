import React from 'react';
import Head from 'next/head';
import SignOutContainer from '@/components/auth/signout/SignoutContainer';

const SignOutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <SignOutContainer />
    </>
  );
};

export default SignOutPage;
