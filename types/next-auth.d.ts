import { AvatarConfig } from '@/types/main';
import { User as UserModel } from '@prisma/client';
import { Account } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: Account.accessToken;
    // user: User & DefaultSession['user'];
    user?: UserModel & {
      avatarConfig?: AvatarConfig;
    };
  }

  interface User extends UserModel {
    avatarConfig?: AvatarConfig;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: Account.accessToken;
  }
}
