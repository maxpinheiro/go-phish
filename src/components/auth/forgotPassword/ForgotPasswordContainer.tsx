import { requestPasswordResetEmail } from '@/client/auth.client';
import ForgotPasswordConfirmation from '@/components/auth/forgotPassword/ForgotPasswordConfirmation';
import ForgotPasswordForm from '@/components/auth/forgotPassword/ForgotPasswordForm';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { ResponseStatus } from '@/types/main';
import { isValidEmail } from '@/utils/utils';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ForgotPasswordContainer: React.FC = ({}) => {
  const [loading, setLoading] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState<string | null>(null);

  const submit = async (email: string) => {
    if (!isValidEmail(email)) {
      return toast.error('Invalid email address!', { duration: 3000 });
    }
    setLoading(true);
    const response = await requestPasswordResetEmail(email);
    if (response === ResponseStatus.Success) {
      setEmailRecipient(email);
    } else if (response === ResponseStatus.NotFound) {
      toast.error('No account found with email.', { duration: 3000 });
    } else {
      toast.error('An unknown error occurred.', { duration: 3000 });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-500 items-center px-6 mx-auto">
      <p className="text-subtitle-regular my-5">Forgot Password</p>
      {emailRecipient ? (
        <ForgotPasswordConfirmation emailRecipient={emailRecipient} resubmit={() => setEmailRecipient(null)} />
      ) : (
        <ForgotPasswordForm submit={submit} />
      )}
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default ForgotPasswordContainer;
