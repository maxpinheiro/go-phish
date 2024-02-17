import { ResponseStatus } from '@/types/main';
import { apiRoot } from './user.client';

export const requestPasswordResetEmail = async (
  email: string
): Promise<ResponseStatus.Success | ResponseStatus.NotFound | ResponseStatus.UnknownError> => {
  const response = await fetch(`${apiRoot}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ email }),
  });
  if (response.status === 200) {
    return ResponseStatus.Success;
  } else if (response.status === 404) {
    return ResponseStatus.NotFound;
  } else {
    return ResponseStatus.UnknownError;
  }
};
