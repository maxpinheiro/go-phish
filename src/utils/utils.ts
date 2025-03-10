import { isGuess } from '@/models/guess.model';
import { isRun } from '@/models/run.model';
import { isShow } from '@/models/show.model';
import { isSong } from '@/models/song.model';
import { emptyUser, isUser } from '@/models/user.model';
import { isVenue } from '@/models/venue.model';
import { Guess, User } from '@prisma/client';
import toast from 'react-hot-toast';
import { compareTwoStrings } from 'string-similarity';

export const parseObj = (_key: string, value: any) =>
  typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;

export const stringSimilarity = (string1: string, string2: string): number => compareTwoStrings(string1, string2);

export const isUndfn = (val: any): val is undefined => val === undefined;

export const allUndfn = (vals: any[]) => vals.every((val) => isUndfn(val));

// export const removeAnyUndfn = <T>(vals: (T | undefined)[]): T[] => vals.filter(x => Array.isArray(x) ? x.every(v => !isUndfn(v)) : !isUndfn(x));

export const mapRange = (value: number, oldStart: number, oldEnd: number, newStart: number, newEnd: number): number =>
  ((value - oldStart) * (newEnd - newStart)) / (oldEnd - oldStart) + newStart;

export const toTitleCase = (str: string): string =>
  str
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

export const arrayToDictByID = <T extends { id: string | number }>(arr: T[]): Record<string, T> => {
  let dict: Record<string | number, T> = {};
  arr.forEach((item) => {
    dict[item.id || ''] = item;
  });
  return dict;
};

export const organizeArrayByField = <T extends Record<string, any>>(arr: T[], field: string): Record<string, T[]> => {
  let dict: Record<string, T[]> = {};
  arr.forEach((item) => {
    if (field in item) {
      if (item[field] in dict) {
        dict[item[field]].push(item);
      } else {
        dict[item[field]] = [item];
      }
    }
  });
  return dict;
};

export const zip = <A, B>(a: A[], b: B[]): [A, B][] => a.map((k, i) => [k, b[i]]);

export const setDifference = <T>(aList: T[], bList: T[]): Set<T> => {
  //let a = new Set(aList);
  let b = new Set(bList);
  let difference = new Set([...aList].filter((x) => !b.has(x)));
  return difference;
};

export const setDifferenceGen = function* <T>(aList: T[], bList: T[]): Generator<T> {
  const setA = new Set(aList);
  const setB = new Set(bList);

  for (const v of setB.values()) {
    if (!setA.delete(v)) {
      yield v;
    }
  }

  for (const v of setA.values()) {
    yield v;
  }
};

export const totalScoresForRuns = (organizedScores: Record<string, Guess[]>): Record<string, number> => {
  let scoresForRuns: Record<string, number> = {};
  Object.entries(organizedScores).forEach(([runId, scores]: [string, Guess[]]) => {
    scoresForRuns[runId] = scores.map((score) => score.points).reduce((acc, curr) => acc + curr);
  });
  return scoresForRuns;
};

export const organizeGuessesByUserId = (guesses: Guess[]): Record<number, Guess[]> => {
  let guessesDict: Record<number, Guess[]> = {};
  guesses.forEach((guess) => {
    if (guess.userId in guessesDict) {
      guessesDict[guess.userId].push(guess);
    } else {
      guessesDict[guess.userId] = [guess];
    }
  });

  return guessesDict;
};

export const organizeScoresByUserId = (scores: Guess[]): Record<number, Guess[]> => {
  let scoresDict: Record<number, Guess[]> = {};
  scores.forEach((score) => {
    if (score.userId in scoresDict) {
      scoresDict[score.userId].push(score);
    } else {
      scoresDict[score.userId] = [score];
    }
  });

  return scoresDict;
};

export const rankScores = (scores: Guess[]): { userId: number; points: number }[] => {
  const scoresDict: Record<number, Guess[]> = organizeScoresByUserId(scores.filter((s) => s.completed));
  let scoresRanked: { userId: number; points: number }[] = [];
  Object.keys(scoresDict).forEach((userId) => {
    scoresRanked.push({
      userId: parseInt(userId),
      points: scoresDict[parseInt(userId)].map((score) => score.points).reduce((acc, curr) => acc + curr),
    });
  });
  return scoresRanked.sort((a, b) => a.points - b.points);
};

export const rankScoresObj = (scores: Guess[], users: User[]): { user: User; points: number }[] => {
  const scoresDict: Record<number, Guess[]> = organizeArrayByField(
    scores.filter((s) => s.completed),
    'userId'
  );
  let scoresRanked: { user: User; points: number }[] = [];
  Object.keys(scoresDict).forEach((userId) => {
    scoresRanked.push({
      user: users.find((u) => u.id == parseInt(userId)) || emptyUser,
      points: scoresDict[parseInt(userId)].map((score) => score.points).reduce((acc, curr) => acc + curr),
    });
  });
  return scoresRanked.sort((a, b) => b.points - a.points);
};

export const rankUsers = (scores: Guess[]): Record<number, number> => {
  const scoresDict: Record<number, Guess[]> = organizeScoresByUserId(scores);
  const usersDict: Record<number, number> = {};
  Object.keys(scoresDict).forEach((userId) => {
    usersDict[parseInt(userId)] = scoresDict[parseInt(userId)]
      .map((score) => score.points)
      .reduce((acc, curr) => acc + curr);
  });
  return usersDict;
};

/*
    completed, non-encore,
    completed, encore,
    uncompleted, non-encore
    uncompleted, encore
*/
export const guessSorter = (a: Guess, b: Guess): number => {
  if (a.completed && !b.completed) return -1;
  else if (b.completed && !a.completed) return 1;
  else if (a.completed && b.completed) {
    if (a.encore && !b.encore) return 1;
    else if (b.encore && !a.encore) return -1;
  } else if (!a.completed && !b.completed) {
    if (a.encore && !b.encore) return 1;
    else if (b.encore && !a.encore) return -1;
  }
  return 0;
};

export const generateCode = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const isValidEmail = (email: string): boolean => {
  return !!String(email).match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

/**
 * Same as Promise.all(items.map(item => task(item))), but it waits for
 * the first {batchSize} promises to finish before starting the next batch.
 *
 */
export const promiseAllInBatches = async <A, B>(
  items: A[],
  task: (a: A) => Promise<B>,
  batchSize = 50
): Promise<B[]> => {
  let position = 0;
  let results: B[] = [];
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize);
    results = [...results, ...(await Promise.all(itemsForBatch.map((item) => task(item))))];
    position += batchSize;
  }
  return results;
};

export const getModelName = (obj: Object): string | null => {
  if (isGuess(obj)) return 'Guess';
  else if (isRun(obj)) return 'Run';
  else if (isShow(obj)) return 'Show';
  else if (isSong(obj)) return 'Song';
  else if (isUser(obj)) return 'User';
  else if (isVenue(obj)) return 'Venue';
  else return null;
};

export const showError = (message: string, duration = 3000) => {
  toast.error(message, { duration });
};
