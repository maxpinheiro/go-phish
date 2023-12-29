import { useThemeContext } from '@/store/theme.store';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import InputField from '@/components/shared/InputField';
import { isValidEmail } from '@/utils/utils';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import toast from 'react-hot-toast';

interface EmailLoginProps {
  onLogin: () => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailRecipient, setEmailRecipient] = useState<string | null>(null);
  const { color } = useThemeContext();

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 });
  };

  const tryLogin = async (email: string | null) => {
    setEmailRecipient(null);
    if (!email || !isValidEmail(email)) {
      showError('Invalid email.');
    } else {
      setLoading(true);
      const res = await signIn('email', { email, redirect: false });
      //const res = await signIn('email', { email });
      console.log(res);
      if (res?.ok) {
        //onLogin();
        setEmailRecipient(email);
        setLoading(false);
      } else {
        showError(`Could not login: ${res?.error || 'unknown error'}`);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <InputField label="Email:" value={email} placeholder="email" onChange={setEmail} showValidation={false} />
      {emailRecipient && (
        <div className="flex flex-col items-center text-justify space-y-2 mt-6">
          <p>
            A login email has been sent to {emailRecipient}. Please check your email to access your account. If you
            don&apos;t see the email in your inbox, don&apos;t forget to check your spam folder.
          </p>
          <p>Need assistance? Contact our support team at help@phishingphun.com.</p>
        </div>
      )}
      <button
        onClick={() => tryLogin(email)}
        disabled={loading}
        className={`auth-button w-full bg-${color} text-white rounded-lg py-2 mt-12`}
      >
        <p className="text-lg">Send Sign-In Link</p>
      </button>
      {loading && <LoadingOverlay />}
    </>
  );
};

export default EmailLogin;
