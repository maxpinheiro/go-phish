import { AvatarConfig, AvatarType } from '@/types/main';
import { Guess, User } from '@prisma/client';

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
  hometown: null,
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
    head: 'face',
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

const userFields = [
  'username',
  'name',
  'bio',
  'hometown',
  'email',
  'emailVerified',
  'image',
  'admin',
  'avatarType',
  'avatar',
  'friend_ids',
];

export const isUser = (obj: Object): obj is User => userFields.every((f) => obj.hasOwnProperty(f));
