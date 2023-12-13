import LoadingOverlay from '@/components/shared/LoadingOverlay';
import EyeIcon from '@/media/Eye.svg';
import EyeSlashIcon from '@/media/EyeSlash.svg';
import { useThemeContext } from '@/store/theme.store';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '@/components/shared/InputField';

interface CredentialsLoginProps {
  onLogin: () => void;
}

const CredentialsLogin: React.FC<CredentialsLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { color } = useThemeContext();

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
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
        />
      </div>
      {error && <p className="mt-4 text-red text-center">Error: {error}</p>}
      <button
        onClick={() => tryLogin(username, password)}
        disabled={loading}
        className={`auth-button w-full bg-${color} text-white rounded-lg py-2 mt-10 mb-4`}
      >
        <p className="text-lg">Sign In</p>
      </button>
      <Link href="/forgot-password" className="text-center cursor-pointer mt-2">
        Forgot username/password?
      </Link>
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
