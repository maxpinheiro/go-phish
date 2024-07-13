import { ResponseStatus } from '@/types/main';
import { randomBytes } from 'crypto';

import prisma from '@/services/db.service';
import { VerificationToken } from '@prisma/client';
import moment from 'moment-timezone';
import superjson from 'superjson';

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

export async function fetchVerificationToken(token: string): Promise<VerificationToken | ResponseStatus.NotFound> {
  const verificationToken = await prisma.verificationToken.findFirst({ where: { token } });
  if (!verificationToken) return ResponseStatus.NotFound;
  return superjson.parse<VerificationToken>(superjson.stringify(verificationToken));
}

export async function deleteVerificationToken(
  token: string
): Promise<ResponseStatus.Success | ResponseStatus.NotFound> {
  try {
    await prisma.verificationToken.delete({ where: { token } });
    return ResponseStatus.Success;
  } catch (e) {
    console.log(e);
    return ResponseStatus.NotFound;
  }
}
