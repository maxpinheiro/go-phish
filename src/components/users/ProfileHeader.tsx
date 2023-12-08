import AdminIcon from '@/media/AdminIcon.svg';
import CheckIcon from '@/media/CheckIcon.svg';
import EditIcon from '@/media/EditIcon.svg';
import SignoutIcon from '@/media/SignoutIcon.svg';
import { AvatarConfig } from '@/types/main';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { AvatarIconSized } from '../shared/Avatar/AvatarIcon';
import Modal from 'react-modal';
import AvatarEditorModal from './AvatarEditor';
import { useTheme } from 'next-themes';
import ProfileControls from './ProfileControls';
import { useSelector } from 'react-redux';
import { selectEditing } from '@/store/profile.store';
import { defaultAvatar } from '@/models/user.model';

Modal.setAppElement('#__next');

interface ProfileHeaderProps {
  user: User;
}

const neutral900 = 'rgb(23, 23, 23)';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const myProfile = currentUserId === user.id;

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const editing = useSelector(selectEditing);
  const [avatar, setAvatar] = useState<AvatarConfig>(JSON.parse(JSON.stringify(user.avatar)) || defaultAvatar);

  return (
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
              <EditIcon className="fill-black dark:fill-white" />
            </div>
          </>
        )}
      </div>
      <p className="text-3xl font-medium ml-2.5">{user.username}</p>
      {myProfile && <ProfileControls user={user} />}
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

export default ProfileHeader;
