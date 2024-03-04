import React from 'react';
import Head from 'next/head';
import ForgotPasswordContainer from '@/components/auth/forgotPassword/ForgotPasswordContainer';

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
