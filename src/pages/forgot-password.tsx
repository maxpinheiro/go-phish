import ForgotPasswordContainer from '@/components/auth/forgotPassword/ForgotPasswordContainer';
import Head from 'next/head';
import React from 'react';

const ForgotPassword: React.FC = ({}) => {
  return (
    <>
      <Head>
        <title>Forgot Password? | Go Phish</title>
      </Head>
      <ForgotPasswordContainer />
    </>
  );
};

export default ForgotPassword;
