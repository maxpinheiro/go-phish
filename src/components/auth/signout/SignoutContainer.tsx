import { useThemeContext } from '@/store/theme.store';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

const SignOutContainer: React.FC = () => {
  const router = useRouter();
  const redirect = router.query.redirect;
  const { color } = useThemeContext();

  const logout = async () => {
    await signOut({ callbackUrl: `/${redirect || 'auth/signin'}` });
  };

  return (
    <div className="flex flex-col w-full max-w-500 items-center px-6 mx-auto">
      <p className="text-4xl my-5">Logout</p>
      <p className="my-3">Are you sure you want to sign out?</p>
      <button className={`w-full bg-${color} text-white rounded-lg py-2 my-6`} onClick={logout}>
        Sign Out
      </button>
    </div>
  );
};

export default SignOutContainer;
