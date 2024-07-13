import HomeBackground from '@/media/Home.svg';
import { useThemeContext } from '@/store/theme.store';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const HomePage: React.FC = ({}) => {
  const { data: session } = useSession();
  const signedIn = session?.user?.id !== undefined;
  const { color } = useThemeContext();

  return (
    <>
      <Head>
        <title>Go Phish</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col items-center w-screen h-screen relative overflow-x-hidden">
        <div className="home-container" />
        <HomeBackground className={`z-0 h-screen absolute top-0 [&_*]:fill-${color}`} />
        <div className={`cursor-pointer absolute top-1/2 -translate-y-1/2 text-${color} font-semibold`}>
          <Link href={signedIn ? '/shows' : '/api/auth/signin?callbackUrl=/profile'}>
            {signedIn ? 'Shows' : 'Login'}
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
