import CredentialsLogin from '@/components/auth/login/CredentialsLogin';
import EmailLogin from '@/components/auth/login/EmailLogin';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type LoginType = 'credentials' | 'email';

const LoginContainer: React.FC = () => {
  const router = useRouter();
  const redirect = router.query.redirect;
  const [loginType, setLoginType] = useState<LoginType>('credentials');

  const onLogin = () => {
    router.push(redirect ? `/${redirect}` : '/shows');
  };

  return (
    <div className="flex flex-col w-full max-w-500 items-center px-6 mx-auto">
      <p className="text-4xl my-5">Login</p>
      {loginType === 'credentials' && (
        <CredentialsLogin onLogin={onLogin} toggleLoginType={() => setLoginType('email')} />
      )}
      {loginType === 'email' && <EmailLogin onLogin={onLogin} toggleLoginType={() => setLoginType('credentials')} />}
    </div>
  );
};

export default LoginContainer;
