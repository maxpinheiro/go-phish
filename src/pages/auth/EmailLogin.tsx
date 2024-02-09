import { useThemeContext } from '@/store/theme.store';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import InputField from '@/components/shared/InputField';
import { isValidEmail } from '@/utils/utils';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import toast from 'react-hot-toast';
import EnvelopeOpenIcon from '@/media/EnvelopeOpen.svg';

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
      try {
        const res = await signIn('email', { email, redirect: false });
        if (res?.ok) {
          //onLogin();
          setEmailRecipient(email);
          setEmail(null);
          setLoading(false);
        } else {
          showError(`Could not login: ${res?.error || 'unknown error'}`);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        showError(`Could not login: ${(e as Error).message || 'unknown error'}`);
        setLoading(false);
      }
    }
  };

  return (
    <>
      {emailRecipient ? (
        <div className="flex flex-col items-center text-justify space-y-4 mt-6">
          <EnvelopeOpenIcon className={`fill-${color} mb-2`} width={80} height={80} />
          <p>
            A login email has been sent to <b className="font-semibold">{emailRecipient}</b>. Please check your email to
            access your account.
          </p>
          <p>
            Due to high volumes of web traffic, it may take up to 5-10 minutes for the email to arrive. If you
            don&apos;t see it in your inbox, please also check your spam folder.
          </p>
          <p>
            Need assistance? Contact our support team at{' '}
            <a href="mailto:support@phishingphun.com" className={`text-${color}`}>
              support@phishingphun.com
            </a>
            .
          </p>
        </div>
      ) : (
        <InputField
          label="Email:"
          value={email}
          placeholder="email"
          onChange={setEmail}
          onEnter={() => tryLogin(email)}
          showValidation={false}
        />
      )}
      <button
        onClick={() => (emailRecipient ? setEmailRecipient(null) : tryLogin(email))}
        disabled={loading}
        className={`auth-button w-full bg-${color} text-white rounded-lg py-2 mt-12`}
      >
        <p className="text-lg">{emailRecipient ? 'Use Another Email' : 'Send Sign-In Link'}</p>
      </button>
      {loading && <LoadingOverlay />}
    </>
  );
};

export default EmailLogin;
