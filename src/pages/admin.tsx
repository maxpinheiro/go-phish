import ErrorMessage from '@/components/shared/ErrorMessage';
import { useThemeContext } from '@/store/theme.store';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const Admin: React.FC = () => {
  const { data: session } = useSession();
  const currentUserAdmin = session?.user?.admin;
  const { color } = useThemeContext();

  if (!currentUserAdmin) return <ErrorMessage error={'You must have admin priviliges to view this page!'} />;

  return (
    <>
      <Head>
        <title>Admin | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center">
        <p className="text-title-regular my-4">Admin</p>
        <div className={`flex flex-col items-center space-y-4 text-${color} text-lg`}>
          <Link className="" href={'/admin/shows'}>
            Moderate Show
          </Link>
          {/* <button className="" onClick={() => setOpenSection('shows')}>
          Add/Remove Users
        </button> */}
        </div>
      </div>
    </>
  );
};

export default Admin;
