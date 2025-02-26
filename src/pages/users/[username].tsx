import ProfilePageComponent from '@/components/users/profile/ProfilePage';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const username = router.query.username?.toString() ?? null;

  return (
    <>
      <Head>
        <title>{`${username} | Go Phish`}</title>
      </Head>
      {username && <ProfilePageComponent username={username} />}
    </>
  );
};

export default ProfilePage;
