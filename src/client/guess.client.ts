import { ResponseStatus, SetlistSong } from '@/types/main';
import { Guess } from '@prisma/client';
import { apiRoot } from './user.client';

export const createGuess = (
  userId: number,
  runId: number,
  showId: number,
  songId: string,
  songName: string,
  encore: boolean
): Promise<Guess | ResponseStatus.Conflict | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/guesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, runId, showId, songId, songName, encore }),
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.hasOwnProperty('guess')) {
        resolve(data.guess as Guess);
      } else {
        resolve(ResponseStatus.UnknownError);
      }
    } else if (response.status === 409) {
      resolve(ResponseStatus.Conflict);
    } else {
      resolve(ResponseStatus.UnknownError);
    }
  });
};

export const deleteGuess = (guessId: number): Promise<ResponseStatus.Success | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/guesses/${guessId}`, { method: 'DELETE' });
    if (response.status === 200) {
      resolve(ResponseStatus.Success);
    } else {
      resolve(ResponseStatus.UnknownError);
    }
  });
};

export const scoreGuessesForShow = (
  showId: number,
  songs: SetlistSong[]
): Promise<ResponseStatus.Success | ResponseStatus.UnknownError> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/shows/${showId}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ songs }),
    });
    if (response.status === 200) {
      resolve(ResponseStatus.Success);
    } else {
      resolve(ResponseStatus.UnknownError);
    }
  });
};

export const fetchGuessesForUserForShow = (
  userId: number,
  showId: number
): Promise<Guess[] | ResponseStatus.NotFound> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/guesses?userId=${userId}&showId=${showId}`);
    if (response.status === 200) {
      const data = await response.json();
      if (data.hasOwnProperty('guesses')) {
        resolve(data.guesses as Guess[]);
      } else {
        resolve(ResponseStatus.NotFound);
      }
    } else {
      resolve(ResponseStatus.NotFound);
    }
  });
};

export const fetchGuessesForUserForRun = (
  userId: number,
  runId: number
): Promise<Guess[] | ResponseStatus.NotFound> => {
  return new Promise(async (resolve) => {
    const response = await fetch(`${apiRoot}/guesses?userId=${userId}&runId=${runId}`);
    if (response.status === 200) {
      const data = await response.json();
      if (data.hasOwnProperty('guesses')) {
        resolve(data.guesses as Guess[]);
      } else {
        resolve(ResponseStatus.NotFound);
      }
    } else {
      resolve(ResponseStatus.NotFound);
    }
  });
};
