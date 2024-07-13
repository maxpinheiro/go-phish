import { AvatarType, ResponseStatus } from '@/types/main';
import { Prisma, User } from '@prisma/client';
import superjson from 'superjson';
//import { testUsers } from "../testData/users";

import { UserWithGuesses } from '@/models/user.model';
import prisma from '@/services/db.service';

// TODO: protect certain fields (password, email)

export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return superjson.parse<User[]>(superjson.stringify(users));
}

export async function getUserById(userId: number): Promise<User | ResponseStatus.NotFound> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return ResponseStatus.NotFound;
  return superjson.parse<User>(superjson.stringify(user));
}

export async function getUserByUsername(username: string): Promise<User | ResponseStatus.NotFound> {
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) return ResponseStatus.NotFound;
  return superjson.parse<User>(superjson.stringify(user));
}

export async function getUserWithGuesses(userId: number): Promise<UserWithGuesses | ResponseStatus.NotFound> {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { guesses: true } });
  if (!user) return ResponseStatus.NotFound;
  return superjson.parse<UserWithGuesses>(superjson.stringify(user));
}

export async function getUsersByIds(userIds: number[]): Promise<User[] | ResponseStatus.NotFound> {
  if (userIds.length === 0) return [];

  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  if (users.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<User[]>(superjson.stringify(users));
}

export async function getUserByEmail(email: string): Promise<User | ResponseStatus.NotFound> {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return ResponseStatus.NotFound;
  return superjson.parse<User>(superjson.stringify(user));
}

/*export const getUserForQuery = async (
  query: UpdateUserDto,
  orderBy?: UserOrderByQuery
): Promise<User[] | 'not found'> => {
  const users = await prisma.user.findMany({
    orderBy: orderBy || {},
    where: { ...query },
  });
  return users || 'not found';
};*/

export async function updateUser(
  userId: number,
  userData: Prisma.UserUpdateInput
): Promise<User | ResponseStatus.NotFound> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    return user;
  } catch (e) {
    console.log(e);
    return ResponseStatus.NotFound;
  }
}

export async function updateUserAvatar(
  userId: number,
  head: string,
  torso: string,
  background: string,
  type?: AvatarType
): Promise<User | ResponseStatus.NotFound> {
  try {
    const newUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: { head, torso, background, type: type || 'user' } },
    });
    return newUser;
  } catch (e) {
    console.log(e);
    return ResponseStatus.NotFound;
  }
}

export async function createUser(
  username: string,
  password: string,
  bio: string,
  email?: string,
  friend_ids?: number[]
): Promise<User> {
  const newUser = await prisma.user.create({
    data: { username, password, email, bio, friend_ids: friend_ids || [] },
  });
  return newUser;
}

export async function attemptLogin(username: string, password: string): Promise<User | ResponseStatus.NotFound> {
  const user = await prisma.user.findFirst({ where: { username, password } });
  return user || ResponseStatus.NotFound;
}

export async function attemptSignup(
  username: string,
  password: string,
  email: string
): Promise<User | 'name conflict' | 'email conflict'> {
  const existingNameUser = await prisma.user.findFirst({ where: { username } });
  if (existingNameUser) return 'name conflict'; // SignupResponse.NameConflict;

  const existingEmailUser = await prisma.user.findFirst({ where: { email } });
  if (existingEmailUser) return 'email conflict'; // SignupResponse.EmailConflict;

  const user = await prisma.user.create({ data: { username, password, email, bio: '' } });
  return user;
}
