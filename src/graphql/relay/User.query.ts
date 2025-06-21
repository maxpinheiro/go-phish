import { User } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { UserFragment$data, UserFragment$key } from './__generated__/UserFragment.graphql';

export const UserFragment = graphql`
  fragment UserFragment on User {
    id
    userId
    username
    name
    bio
    hometown
    email
    image
    admin
    avatar {
      head
      torso
      background
      type
    }
    avatarType
  }
`;

export const formatUser = (user: UserFragment$data): User => ({
  ...user,
  id: user.userId,
  name: user.name ?? null,
  bio: user.bio ?? '',
  hometown: user.hometown ?? null,
  email: user.email ?? null,
  emailVerified: null,
  image: user.image ?? null,
  avatarType: user.avatarType ?? null,
  avatar: user.avatar ?? null,
  password: '',
  friend_ids: [],
});

export const useUserFragment = (user: UserFragment$key): User => {
  const userData = useFragment<UserFragment$key>(UserFragment, user);
  return formatUser(userData);
};
