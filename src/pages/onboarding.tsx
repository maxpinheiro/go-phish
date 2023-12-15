import { updateUser } from '@/client/user.client';
import { AvatarIconSized } from '@/components/shared/Avatar/AvatarIcon';
import InputField from '@/components/shared/InputField';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import AvatarEditorModal from '@/components/users/AvatarEditor/AvatarEditor';
import EditIcon from '@/media/EditIcon.svg';
import { defaultAvatar } from '@/models/user.model';
import { getUserById } from '@/services/user.service';
import { useThemeContext } from '@/store/theme.store';
import { AvatarConfig, ResponseStatus } from '@/types/main';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface OnboardingProps {
  userId: number;
  username: string;
  initName: string | null;
  initHometown: string | null;
  initBio: string | null;
  initAvatar: AvatarConfig;
}

export const getServerSideProps: GetServerSideProps<OnboardingProps> = async (context) => {
  const session = await getSession(context);
  const userId = session?.user?.id;
  const username = session?.user?.username;

  if (!userId || !username) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const user = await getUserById(userId);
  if (user === ResponseStatus.NotFound) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      userId,
      username,
      initName: user.name || '',
      initHometown: user.hometown || '',
      initBio: user.bio,
      initAvatar: JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig,
    },
  };
};

const Onboarding: React.FC<OnboardingProps> = ({ userId, username, initName, initHometown, initBio, initAvatar }) => {
  const router = useRouter();
  const [name, setName] = useState<string | null>(initName);
  const [hometown, setHometown] = useState<string | null>(initHometown);
  const [bio, setBio] = useState<string | null>(initBio);
  const [avatar, setAvatar] = useState<AvatarConfig>(initAvatar || defaultAvatar);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { color } = useThemeContext();

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const openProfile = () => {
    router.push(`/users/${username}`);
  };

  const saveUserInfo = async () => {
    if (!name || !hometown || !bio) {
      openProfile();
    } else {
      const userData = { name, bio, hometown };
      try {
        setLoading(true);
        const newUser = await updateUser(userId, userData);
        if (newUser === ResponseStatus.Unauthorized) {
          showError('You are not authorized to edit this account!');
        } else if (newUser === ResponseStatus.UnknownError) {
          showError('An unknown error occurred. Please try again or refresh the page.');
        } else {
          openProfile();
        }
        setLoading(false);
      } catch (e) {
        showError(`An unknown error occurred: ${(e as Error).message}`);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Login | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center px-6">
        <p className="text-4xl my-5">Finish Your Account</p>
        <p className={`w-full text-right text-${color} cursor-pointer`} onClick={openProfile}>
          Skip for Now
        </p>
        <div className="relative mb-2">
          <AvatarIconSized type={avatar.type || 'user'} config={avatar} size={100} />
          <div
            onClick={() => setAvatarModalOpen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          >
            <EditIcon className="fill-black dark:fill-white opacity-50" />
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-full">
          <InputField label="Name" value={name} placeholder="Name" onChange={setName} />
          <InputField label="Hometown" value={hometown} placeholder="Hometown" onChange={setHometown} />
          <InputField label="About Me" value={bio || ''} placeholder="Enter bio here" onChange={setBio} numLines={3} />
        </div>
        {error && <p className="mt-4 text-red text-center">Error: {error}</p>}
        <button
          onClick={saveUserInfo}
          disabled={loading}
          className={`auth-button w-full bg-${color} text-white rounded-lg py-2 mt-10 mb-4`}
        >
          <p className="text-lg">Save</p>
        </button>
        {loading && <LoadingOverlay />}
        {avatarModalOpen && (
          <AvatarEditorModal
            initConfig={avatar}
            closeModal={(newConfig) => {
              setAvatarModalOpen(false);
              if (newConfig) setAvatar(newConfig);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Onboarding;
