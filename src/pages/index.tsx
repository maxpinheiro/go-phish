import LeftArrow from '@/media/LeftArrow.svg';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import HomeBackground from '@/media/Home.svg';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useThemeContext } from '@/store/theme.store';

interface BackArrowProps {
  link?: string;
  className?: string;
  svgClass?: string;
  width?: number;
  height?: number;
  children?: JSX.Element;
}
export const BackArrow: React.FC<BackArrowProps> = ({
  link,
  className = 'cursor-pointer',
  svgClass = '',
  width,
  height,
  children,
}) => {
  const router = useRouter();
  return (
    <div onClick={() => router.push(link || '/shows')} className={className}>
      <LeftArrow width={width} height={height} className={svgClass} />
      {children}
    </div>
  );
};

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
