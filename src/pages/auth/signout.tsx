import SignOutContainer from '@/components/auth/signout/SignoutContainer';
import Head from 'next/head';
import React from 'react';

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
