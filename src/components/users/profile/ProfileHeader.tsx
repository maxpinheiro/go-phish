import { defaultAvatar } from '@/models/user.model';
import { AvatarConfig } from '@/types/main';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { AvatarIconSized } from '../shared/Avatar/AvatarIcon';
import ProfileControls from './ProfileControls';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const myProfile = currentUserId === user.id;
  const avatar: AvatarConfig = JSON.parse(JSON.stringify(user.avatar)) || defaultAvatar;

  return (
    <div className="flex items-center mx-2.5 my-2.5">
      <div className="relative">
        <AvatarIconSized type={avatar.type || 'user'} config={avatar} size={60} />
      </div>
      <p className="text-3xl font-medium ml-2.5">{user.username}</p>
      {myProfile && <ProfileControls user={user} />}
    </div>
  );
};

export default ProfileHeader;
