import AdminIcon from '@/media/AdminIcon.svg';
import CheckIcon from '@/media/CheckIcon.svg';
import EditIcon from '@/media/EditIcon.svg';
import SignoutIcon from '@/media/SignoutIcon.svg';
import { AvatarConfig } from '@/types/main';
import { OrganizedRunItem } from '@/utils/guess.util';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { AvatarIconSized } from '../shared/Avatar/AvatarIcon';
import AboutMe from './AboutMe';
import RunRecord from './RunRecord';
import Modal from 'react-modal';
import AvatarEditorModal from './AvatarEditor';
import { useTheme } from 'next-themes';

Modal.setAppElement('#__next');

interface UserInfoProps {
  user: User;
  runRecord: OrganizedRunItem[];
}

const neutral900 = 'rgb(23, 23, 23)';

const UserInfo: React.FC<UserInfoProps> = ({ user, runRecord }) => {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const myProfile = currentUserId === user.id;
  const [editing, setEditing] = useState<boolean>(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig>(JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig);

  const Header = () => (
    <div className="flex items-center mx-2.5 my-2.5">
      <div className="relative">
        <AvatarIconSized type={avatar.type || 'user'} config={avatar} size={60} />
        {editing && (
          <>
            <div className="w-full h-full absolute top-0 left-0 bg-white opacity-5 rounded-full" />
            <div
              onClick={() => setAvatarModalOpen(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            >
              <EditIcon />
            </div>
          </>
        )}
      </div>
      <p className="text-3xl font-medium ml-2.5">{user.username}</p>
      {myProfile && (
        <div className="flex items-center justify-end grow space-x-2">
          {user.admin && (
            <Link href="/admin">
              <AdminIcon width={24} height={24} className="fill-black dark:fill-white" />
            </Link>
          )}
          <p
            className="cursor-pointer"
            onClick={() => {
              editing ? setEditing(false) : setEditing(true);
            }}
          >
            {editing ? (
              <CheckIcon width={18} height={18} className="fill-black dark:fill-white" />
            ) : (
              <EditIcon width={18} height={18} className="fill-black dark:fill-white" />
            )}
          </p>
          <Link href="/api/auth/signout" className="cursor-pointer mt-0.5">
            <SignoutIcon width={22} height={22} className="fill-black dark:fill-white" />
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-500 mt-2" id="user-info">
      <Header />
      <div className="flex flex-col mx-2.5">
        <AboutMe user={user} />
        <RunRecord runRecord={runRecord} />
      </div>
      <Modal
        isOpen={avatarModalOpen}
        onRequestClose={() => setAvatarModalOpen(false)}
        contentLabel="Avatar Editor"
        overlayClassName="bg-white/75 dark:bg-neutral-900/75"
        style={{
          content: {
            top: '68px',
            left: '12px',
            right: '12px',
            bottom: '12px',
            backgroundColor: theme === 'dark' ? neutral900 : '#fff',
          },
        }}
      >
        <AvatarEditorModal
          initConfig={JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig}
          closeModal={(newConfig) => {
            setAvatarModalOpen(false);
            setAvatar(newConfig);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserInfo;
