import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ResetPasswordContainer from '@/components/auth/resetPassword/ResetPasswordContainer';
import ErrorMessage from '@/components/shared/ErrorMessage';

const ResetPasswordPage: React.FC = ({}) => {
  const router = useRouter();
  const token = router.query.token?.toString();

  return (
    <>
      <Head>
        <title>Reset Password | Go Phish</title>
      </Head>
      {token ? (
        <ResetPasswordContainer token={token} />
      ) : (
        <ErrorMessage error="Invalid url: missing verification token." />
      )}
    </>
  );
};

export default ResetPasswordPage;
