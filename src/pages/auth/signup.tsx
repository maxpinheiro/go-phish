import SignUpContainer from '@/components/auth/signup/SignupContainer';
import Head from 'next/head';
import React from 'react';

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
