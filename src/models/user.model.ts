import { Guess, User } from '@prisma/client';
import { AvatarConfig, AvatarType } from '@/types/main';

export type UserWithGuesses = User & {
  guesses: Guess[];
};

export const defaultAvatar: AvatarConfig = {
  head: '#ddd',
  torso: '#aaa',
  background: '#666',
};

export const emptyUser: User = {
  id: 0,
  username: '',
  password: '',
  avatar: JSON.parse(JSON.stringify(defaultAvatar)),
  bio: '',
  friend_ids: [],
  admin: false,
  email: '',
  name: null,
  emailVerified: null,
  image: null,
  avatarType: null,
};

export const avatarColorLabels: Record<AvatarType, Record<keyof Omit<AvatarConfig, 'type'>, string | null>> = {
  user: {
    head: 'head',
    torso: 'body',
    background: 'background',
  },
  donut: {
    head: null,
    torso: 'icing',
    background: 'donut',
  },
  fish: {
    head: 'head',
    torso: 'body',
    background: 'background',
  },
  alien: {
    head: 'head',
    torso: 'torso',
    background: 'background',
  },
};

interface UserStats {}
