import { AvatarConfig, ResponseStatus } from '@/types/main';
import { Prisma, User } from '@prisma/client';

export const apiRoot =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://phishingphun.com/api';

export const attemptLoginClient = (
  username: string,
  password: string
): Promise<User | ResponseStatus.NotFound | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiRoot}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 200) {
        // success
        const data = await response.json();
        if (data.hasOwnProperty('user')) {
          resolve(data.user as User);
        } else {
          resolve(ResponseStatus.UnknownError);
        }
      } else if (response.status === 404) {
        // incorrect username (username not found)
        resolve(ResponseStatus.NotFound);
      } else {
        resolve(ResponseStatus.UnknownError);
      }
    } catch {
      resolve(ResponseStatus.UnknownError);
    }
  });
};

export const attemptSignupClient = (
  username: string,
  password: string,
  email: string
): Promise<User | 'name conflict' | 'email conflict' | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiRoot}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ username, password, email }),
      });
      if (response.status === 200) {
        // success
        const data = await response.json();
        if (data.hasOwnProperty('user')) {
          resolve(data.user as User);
        } else {
          resolve(ResponseStatus.UnknownError);
        }
      } else if (response.status === ResponseStatus.Conflict) {
        const { error } = await response.json();
        resolve(error === 'name conflict' || error === 'email conflict' ? error : ResponseStatus.UnknownError);
      } else {
        resolve(ResponseStatus.UnknownError);
      }
    } catch {
      resolve(ResponseStatus.UnknownError);
    }
  });
};

export const updateAvatarForUser = (
  userId: number,
  config: AvatarConfig
): Promise<ResponseStatus.Success | ResponseStatus.Unauthorized | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiRoot}/users/${userId}/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(config),
      });
      if (response.ok || response.status === 200) {
        resolve(ResponseStatus.Success);
      } else if (response.status === 401) {
        // incorrect username (username not found)
        resolve(ResponseStatus.Unauthorized);
      } else {
        resolve(ResponseStatus.UnknownError);
      }
    } catch {
      resolve(ResponseStatus.UnknownError);
    }
  });
};

export const updateUser = (
  userId: number,
  userData: Prisma.UserUpdateInput
): Promise<User | ResponseStatus.Unauthorized | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiRoot}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok || response.status === 200) {
        const data = await response.json();
        if (data.hasOwnProperty('user')) {
          resolve(data.user);
        } else {
          resolve(ResponseStatus.UnknownError);
        }
      } else if (response.status === 401) {
        resolve(ResponseStatus.Unauthorized);
      } else {
        resolve(ResponseStatus.UnknownError);
      }
    } catch {
      resolve(ResponseStatus.UnknownError);
    }
  });
};
