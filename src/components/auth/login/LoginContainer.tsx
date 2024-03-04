import React, { useState } from 'react';
import { useRouter } from 'next/router';
import CredentialsLogin from '@/components/auth/login/CredentialsLogin';
import EmailLogin from '@/components/auth/login/EmailLogin';

type LoginType = 'credentials' | 'email';

const LoginContainer: React.FC = () => {
  const router = useRouter();
  const redirect = router.query.redirect;
  const [loginType, setLoginType] = useState<LoginType>('credentials');

  const onLogin = () => {
    router.push(redirect ? `/${redirect}` : '/shows');
  };

  return (
    <div className="flex flex-col items-center px-6">
      <p className="text-4xl my-5">Login</p>
      {loginType === 'credentials' && (
        <CredentialsLogin onLogin={onLogin} toggleLoginType={() => setLoginType('email')} />
      )}
      {loginType === 'email' && <EmailLogin onLogin={onLogin} toggleLoginType={() => setLoginType('credentials')} />}
    </div>
  );
};

export default LoginContainer;
