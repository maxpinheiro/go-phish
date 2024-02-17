import { ResponseStatus } from '@/types/main';
import { randomBytes } from 'crypto';

import prisma from '@/services/db.service';
import moment from 'moment-timezone';

export async function createVerificationTokenForUser(
  email: string,
  tokenLength = 64
): Promise<string | ResponseStatus.UnknownError> {
  const expires = moment().add(24, 'hours').toDate();
  const token = randomBytes(Math.ceil(tokenLength / 2)).toString('hex');
  try {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });
    return verificationToken.token;
  } catch (e) {
    console.log(e);
    return ResponseStatus.UnknownError;
  }
}
