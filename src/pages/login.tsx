import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { attemptLoginClient } from '@/client/user.client';
import { ResponseStatus } from '@/types/main';
import EyeIcon from '@/media/Eye.svg';
import EyeSlashIcon from '@/media/EyeSlash.svg';
import { useThemeContext } from '@/store/theme.store';

const Login: React.FC = () => {
  const router = useRouter();
  const redirect = router.query.redirect;
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { color } = useThemeContext();

  const PasswordIcon = showPassword ? EyeIcon : EyeSlashIcon;

  const tryLogin = async (username: string | null, password: string | null) => {
    if (username === null) {
      setError('Missing username.');
    } else if (password === null) {
      setError('Missing password.');
    } else {
      const response = await attemptLoginClient(username, password);
      if (response === ResponseStatus.NotFound) {
        setError('Invalid username/password.');
      }
      window.localStorage.setItem('gp-user', JSON.stringify(response));
      router.push(redirect ? `/${redirect}` : '/shows');
    }
  };

  useEffect(() => {}, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <div></div>
      <div className="flex flex-col items-center">
        <p className="text-2xl my-5">Login</p>
        {error && <p className="text-center mx-10">{error}</p>}
        <div className="flex items-center my-2.5 w-3/4">
          <p className="mr-2.5 w-20vw">Username: </p>
          <input
            className={`grow rounded-lg bg-${color} bg-opacity-10 border border-${color} px-2.5 py-1`}
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
        </div>
        <div className="flex items-center my-2.5 w-3/4">
          <p className="mr-2.5 w-20vw">Password: </p>
          <div
            className={`flex grow rounded-lg bg-${color} bg-opacity-10 border border-${color} row--space-between align-center`}
          >
            <input
              className="flex w-full rounded-lg bg-transparent px-2.5 py-1"
              type={showPassword ? 'text' : 'password'}
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <div onClick={() => setShowPassword((p) => !p)} className="cursor-pointer mx-1.5 my-auto">
              <PasswordIcon width={16} height={16} className="fill-black dark:fill-white " />
            </div>
          </div>
        </div>
        <Link href="/forgot-password" className="text-center cursor-pointer font-light mt-2">
          Forgot username/password?
        </Link>
        <button onClick={() => tryLogin(username, password)} disabled={loading} className="auth-button mt-10">
          <p className="m-0 ">Login</p>
        </button>
        {loading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default Login;
