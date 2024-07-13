import { useThemeContext } from '@/store/theme.store';
import Head from 'next/head';

export default function Custom500Page() {
  const { color } = useThemeContext();
  return (
    <>
      <Head>
        <title>Site Maintenance | GoPhish</title>
      </Head>
      <div className="flex flex-col items-center px-4">
        <p className={`text-4xl text-${color} font-semibold mt-12 mb-8`}>Site Maintenance</p>
        <p className="text-md text-center">
          We&apos;re all in the bathtub now, making some Bathub Gin. We will be back soon!
        </p>
        <a href="https://phish.com/tours/" className={`text-lg text-${color} font-medium my-6`}>
          View Upcoming Tours
        </a>
      </div>
    </>
  );
}
