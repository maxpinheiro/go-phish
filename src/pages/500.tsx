import { useThemeContext } from '@/store/theme.store';
import Head from 'next/head';

export default function Custom500Page() {
  const { color } = useThemeContext();
  return (
    <>
      <Head>
        <title>Site Error | GoPhish</title>
      </Head>
      <div className="flex flex-col items-center px-4">
        <p className={`text-4xl text-${color} font-semibold mt-12 mb-8`}>Site Error</p>
        <p className="text-md text-center">Whoops! Looks like something went wrong.</p>
        <p className="text-md">
          Try refreshing the page or launching a new tab, or{' '}
          <a href="mailto:support@phishingphun.com" className={`text-${color}`}>
            contact support
          </a>{' '}
          if the isssue persists.
        </p>
      </div>
    </>
  );
}
