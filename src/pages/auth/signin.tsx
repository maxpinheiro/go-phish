import React, { useState } from 'react';
import Head from 'next/head';
import CredentialsLogin from '@/components/auth/login/CredentialsLogin';
import EmailLogin from '@/components/auth/login/EmailLogin';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  const username = session?.user?.username;

  // redirect to profile if already logged in
  if (username) {
    return {
      redirect: {
        destination: `/users/${username}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

type LoginType = 'credentials' | 'email';

const SignIn: React.FC = () => {
  const router = useRouter();
  const redirect = router.query.redirect;
  const [loginType, setLoginType] = useState<LoginType>('credentials');

  const onLogin = () => {
    router.push(redirect ? `/${redirect}` : '/shows');
  };

  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <div></div>
      <div className="flex flex-col items-center px-6">
        <p className="text-4xl my-5">Login</p>
        {loginType === 'credentials' && (
          <CredentialsLogin onLogin={onLogin} toggleLoginType={() => setLoginType('email')} />
        )}
        {loginType === 'email' && <EmailLogin onLogin={onLogin} toggleLoginType={() => setLoginType('credentials')} />}
      </div>
    </>
  );
};

export default SignIn;
