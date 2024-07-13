import InputField from '@/components/shared/InputField';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { useThemeContext } from '@/store/theme.store';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface CredentialsLoginProps {
  onLogin: () => void;
  toggleLoginType: () => void;
}

const CredentialsLogin: React.FC<CredentialsLoginProps> = ({ onLogin, toggleLoginType }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { color } = useThemeContext();

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 });
  };

  const tryLogin = async (username: string | null, password: string | null) => {
    if (username === null) {
      showError('Missing username.');
    } else if (password === null) {
      showError('Missing password.');
    } else {
      setLoading(true);
      const res = await signIn('credentials', { username, password, redirect: false });
      console.log(res);
      if (res?.ok) {
        onLogin();
        setLoading(false);
      } else {
        showError(`Could not login: ${res?.error || 'unknown error'}`);
        setLoading(false);
      }
    }
  };

  const onEnter = () => tryLogin(username, password);

  return (
    <>
      <div className="flex flex-col space-y-4 w-full">
        <button className={`w-full text-right text-${color}`} onClick={toggleLoginType}>
          Sign in with Email
        </button>
        <InputField
          label="Username:"
          value={username}
          placeholder="username"
          onChange={setUsername}
          onEnter={onEnter}
        />
        <InputField
          label="Password:"
          value={password}
          placeholder="password"
          hideField
          onChange={setPassword}
          onEnter={onEnter}
          addOnClass="pt-1"
        />
      </div>
      <Link href="/forgot-password" className={`w-full text-left text-${color} mt-5`}>
        Forgot password?
      </Link>
      <button
        onClick={() => tryLogin(username, password)}
        disabled={loading}
        className={`auth-button w-full bg-${color} text-white rounded-lg py-2 mt-6 mb-4`}
      >
        <p className="text-lg">Sign In</p>
      </button>
      <div className="flex items-center space-x-2 mt-6">
        <p>New to GoPhish?</p>
        <Link href="/auth/signup" className={`font-semibold text-${color}`}>
          Signup
        </Link>
        {loading && <LoadingOverlay />}
      </div>
    </>
  );
};

export default CredentialsLogin;
