import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  const username = session?.user?.username;

  if (username === undefined) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/users/${username}`,
        permanent: false,
      },
    };
  }
};

const Profile = () => {
  return <div></div>;
};

export default Profile;
