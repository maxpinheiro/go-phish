import { ResponseStatus } from '@/types/main';
import { apiRoot } from './user.client';

export const suggestSong = (song: string): Promise<ResponseStatus.Success | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/songs/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ song }),
    });
    resolve(response.status === 200 ? ResponseStatus.Success : ResponseStatus.UnknownError);
  });
};
