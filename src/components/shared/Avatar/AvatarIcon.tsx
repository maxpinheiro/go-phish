import { AvatarConfig, AvatarType } from '@/types/main';
import React from 'react';
import { DonutAvatar, DonutAvatarSized } from './DonutAvatar';
import { UserAvatar, UserAvatarSized } from './UserAvatar';

interface AvatarProps {
  type: AvatarType;
  config: AvatarConfig;
}

const Avatars: Record<AvatarType, React.FC<AvatarConfig>> = {
  user: UserAvatar,
  donut: DonutAvatar,
  fish: UserAvatar,
  alien: UserAvatar,
};

const AvatarIcon: React.FC<AvatarProps> = ({ type, config }) => {
  const Avatar = Avatars[type];
  return <Avatar {...config} />;
};

const SizedAvatars: Record<AvatarType, React.FC<AvatarConfig & { size: number }>> = {
  user: UserAvatarSized,
  donut: DonutAvatarSized,
  fish: UserAvatarSized,
  alien: UserAvatarSized,
};

export const AvatarIconSized: React.FC<AvatarProps & { size: number }> = ({ type, config, size }) => {
  const SizedAvatar = SizedAvatars[type];
  return <SizedAvatar {...config} size={size} />;
};

export default AvatarIcon;
