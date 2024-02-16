import { ResponseStatus } from '@/types/main';
import { apiRoot } from './user.client';

export const suggestFeedback = (
  feedback: string,
  contactInfo?: string
): Promise<ResponseStatus.Success | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ feedback, contactInfo }),
    });
    resolve(response.status === 200 ? ResponseStatus.Success : ResponseStatus.UnknownError);
  });
};
