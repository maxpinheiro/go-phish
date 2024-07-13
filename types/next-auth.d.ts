import { AvatarConfig } from '@/types/main';
import { User as UserModel } from '@prisma/client';
import { Account, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: Account.accessToken;
    user: User & DefaultSession['user'];
    // user: {
    //   // id: number | undefined;
    //   // username: string | undefined;
    //   // admin?: boolean | undefined;
    //   // avatarConfig?: AvatarConfig | undefined;
    // } & DefaultSession['user'];
  }

  interface User extends UserModel {
    // id: number; // <- here it is
    id: number | undefined;
    username: string | undefined;
    admin?: boolean | undefined;
    avatarConfig?: AvatarConfig | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: Account.accessToken;
  }
}
