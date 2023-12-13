import React, { useState } from 'react';
import Head from 'next/head';
import EmailLogin from './EmailLogin';
import CredentialsLogin from './CredentialsLogin';
import { useRouter } from 'next/router';
import { useThemeContext } from '@/store/theme.store';

const SignIn: React.FC = () => {
  const router = useRouter();
  const redirect = router.query.redirect;
  const [loginType, setLoginType] = useState<'credentials' | 'email'>('credentials');
  const { color } = useThemeContext();

  const onLogin = () => {
    router.push(redirect ? `/${redirect}` : '/shows');
  };

  const toggleLoginType = () => setLoginType((type) => (type === 'credentials' ? 'email' : 'credentials'));

  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <div></div>
      <div className="flex flex-col items-center px-6">
        <p className="text-4xl my-5">Login</p>
        <button className={`w-full text-right text-${color}`} onClick={toggleLoginType}>
          Sign in with {loginType === 'credentials' ? 'Email' : 'Credentials'}
        </button>
        {loginType === 'credentials' && <CredentialsLogin onLogin={onLogin} />}
        {loginType === 'email' && <EmailLogin onLogin={onLogin} />}
      </div>
    </>
  );
};

export default SignIn;
