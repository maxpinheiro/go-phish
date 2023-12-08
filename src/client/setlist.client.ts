import { AvatarConfig, DateString, ResponseStatus, SetlistSong } from '@/types/main';
import { User } from '@prisma/client';
import { apiRoot } from './user.client';

export const getSetlistForDate = (
  date: DateString
): Promise<SetlistSong[] | ResponseStatus.NotFound | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${apiRoot}/setlist?date=${date}`);
      if (response.ok || response.status === 200) {
        const data = await response.json();
        if (data.hasOwnProperty('setlist')) {
          resolve(data.setlist as SetlistSong[]);
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
