import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ResetPasswordForm from '@/components/auth/resetPassword/ResetPasswordForm';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { resetPassword } from '@/client/auth.client';
import { ResponseStatus } from '@/types/main';

const ResetPassword: React.FC = ({}) => {
  const router = useRouter();
  const token = router.query.token?.toString();
  const [loading, setLoading] = useState(false);

  const submitNewPassword = async (password: string, token: string) => {
    setLoading(true);
    const result = await resetPassword(password, token);
    if (result === ResponseStatus.Success) {
      toast.success('Successfully updated password!', { duration: 3000 });
      setTimeout(() => router.push('/auth/signin'), 3000);
    } else if (result === ResponseStatus.NotFound) {
      toast.error('Invalid verification token', { duration: 3000 });
    } else {
      toast.error('Unknown error occurred', { duration: 3000 });
    }
    setLoading(false);
  };

  if (!token) {
    return <p className="px-6">Invalid url: missing verification token.</p>;
  }
  return (
    <>
      <Head>
        <title>Reset Password | Go Phish</title>
      </Head>
      <div className="flex flex-col px-6">
        <p className="text-subtitle-regular text-center my-5">Reset Your Password</p>
        <ResetPasswordForm submit={(password) => submitNewPassword(password, token)} />
        {loading && <LoadingOverlay />}
      </div>
    </>
  );
};

export default ResetPassword;
