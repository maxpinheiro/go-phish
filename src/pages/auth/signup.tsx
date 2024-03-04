import React from 'react';
import Head from 'next/head';
import SignUpContainer from '@/components/auth/signup/SignupContainer';

const SignUpPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <div></div>
      <SignUpContainer />
    </>
  );
};

export default SignUpPage;
