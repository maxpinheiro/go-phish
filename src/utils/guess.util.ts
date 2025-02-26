import { PreviousGuess } from '@/components/guesses/GuessSelectorModal';
import { GuessWithRun, GuessWithShow, GuessWithShowAndUser } from '@/models/guess.model';
import { ShowWithVenue } from '@/models/show.model';
import { Guess, Run, Show, User } from '@prisma/client';
import moment from 'moment-timezone';
import { formatShowDate } from './show.util';
import { organizeArrayByField } from './utils';

export type OrganizedRunItem = { run: Run; points: number; scores: Guess[] };

export const organizeRunRecord = (guesses: GuessWithRun[]): OrganizedRunItem[] => {
  let runRecord: OrganizedRunItem[] = [];
  const guessesByRun = organizeArrayByField(guesses, 'runId');
  Object.entries(guessesByRun).forEach(([runId, guesses]) => {
    const run = guesses[0].run;
    if (!run) return;
    const score = guesses.map((g) => g.points).reduce((acc, curr) => acc + curr, 0);
    runRecord.push({ run, points: score, scores: guesses.filter((g) => g.completed) });
  });
  runRecord.sort((a, b) => b.points - a.points);
  return runRecord;
};

export type RankedUserScore = { user: User; points: number; guesses: GuessWithShow[] };
export type RankedUserScores = RankedUserScore[];

export const rankScoresByUser = (guessesByUser: Record<number, GuessWithShow[]>, users: User[]): RankedUserScores => {
  let rankedUserScores: RankedUserScores = [];
  Object.entries(guessesByUser).forEach(([userId, guesses]) => {
    const user = users.find((u) => u.id === parseInt(userId));
    if (!user) return;
    const score = guesses.map((g) => g.points).reduce((acc, curr) => acc + curr, 0);
    rankedUserScores.push({ user, points: score, guesses: guesses.filter((g) => g.completed) });
  });
  rankedUserScores.sort((a, b) => b.points - a.points);
  return rankedUserScores;
};

export const rankScoresWithUsers = (guesses: GuessWithShowAndUser[]): RankedUserScores => {
  let rankedUserScores: RankedUserScores = [];
  const guessesByUser = organizeArrayByField<GuessWithShowAndUser>(guesses, 'userId');
  Object.values(guessesByUser).forEach((guesses) => {
    const user = guesses[0].user;
    if (!user) return;
    const score = guesses.map((g) => g.points).reduce((acc, curr) => acc + curr, 0);
    rankedUserScores.push({ user, points: score, guesses: guesses.filter((g) => g.completed) });
  });
  rankedUserScores.sort((a, b) => b.points - a.points);
  return rankedUserScores;
};

export const rankedUserScoresForNight = (scores: RankedUserScores, shows: Show[], night: number): RankedUserScores => {
  const show = shows.find((s) => s.runNight === night);
  return scores
    .map((s) => ({
      ...s,
      points: s.guesses
        .filter((g) => g.showId === show?.id)
        .map((g) => g.points)
        .reduce((acc, curr) => acc + curr, 0),
      guesses: s.guesses.filter((g) => g.showId === show?.id && g.completed),
    }))
    .filter((g) => g.guesses.length > 0)
    .sort((a, b) => b.points - a.points);
};

export type GuessesByCompletion<T extends Guess = Guess> = { complete: T[]; incomplete: T[] };

export type OrganizedGuesses = {
  user: User;
  guesses: GuessesByCompletion;
}[];

export type OrganizedGuessesWithShow = {
  user: User;
  guesses: GuessesByCompletion<GuessWithShow>;
}[];

const groupGuessesByCompletion = <T extends Guess = Guess>(guesses: T[]): GuessesByCompletion<T> => {
  const lookup: GuessesByCompletion<T> = { complete: [], incomplete: [] };
  guesses.forEach((guess) => {
    lookup[guess.completed ? 'complete' : 'incomplete'].push(guess);
  });
  return lookup;
};

export const organizeGuessesByUser = (guessesByUser: Record<number, Guess[]>, users: User[]): OrganizedGuesses => {
  let organizedGuesses: OrganizedGuesses = [];

  Object.entries(guessesByUser).forEach(([userId, guesses]) => {
    const user = users.find((u) => u.id === parseInt(userId));
    if (!user) return;
    let guessDict = groupGuessesByCompletion(guesses);
    organizedGuesses.push({ user, guesses: guessDict });
  });
  organizedGuesses.sort((a, b) => b.guesses.complete.length - a.guesses.complete.length);
  return organizedGuesses;
};

export const organizeGuessesWithUsers = (guesses: GuessWithShowAndUser[]): OrganizedGuessesWithShow => {
  let organizedGuesses: OrganizedGuessesWithShow = [];

  const guessesByUser = organizeArrayByField<GuessWithShowAndUser>(guesses, 'userId');
  Object.values(guessesByUser).forEach((guesses) => {
    const user = guesses[0].user;
    let guessDict = groupGuessesByCompletion<GuessWithShow>(guesses);
    organizedGuesses.push({ user, guesses: guessDict });
  });
  organizedGuesses.sort((a, b) => b.guesses.complete.length - a.guesses.complete.length);
  return organizedGuesses;
};

export const organizedGuessesForNight = (
  guesses: OrganizedGuessesWithShow,
  shows: Show[],
  night: number
): OrganizedGuessesWithShow => {
  const show = shows.find((s) => s.runNight === night);
  return guesses
    .map((g) => ({
      ...g,
      guesses: {
        complete: g.guesses.complete.filter((s) => s.showId === show?.id),
        incomplete: g.guesses.incomplete.filter((s) => s.showId === show?.id),
      },
    }))
    .filter((group) => group.guesses.complete.length + group.guesses.incomplete.length > 0)
    .sort((a, b) => b.guesses.complete.length - a.guesses.complete.length);
};

export const removeDuplicateSongGuesses = (guesses: Guess[]): Guess[] => {
  const uniques: Guess[] = [];
  const uniqueSongIds: string[] = [];
  for (let guess of guesses) {
    if (!uniqueSongIds.includes(guess.songId)) {
      uniques.push(guess);
      uniqueSongIds.push(guess.songId);
    }
  }
  return uniques;
};

export const sortIncompleteGuesses = (guesses: PreviousGuess[]): PreviousGuess[] => {
  let sortedGuesses = [...guesses];
  sortedGuesses.sort((a, b) => (a.encore ? (b.encore ? 0 : 1) : b.encore ? -1 : 0));
  sortedGuesses.sort((a, b) => (a.encore || b.encore ? 0 : a.showId - b.showId));
  return sortedGuesses;
};

export const buildGuessesWithShows = (guesses: Guess[], shows: Show[]): GuessWithShow[] => {
  const showRecord = Object.fromEntries(shows.map((s) => [s.id, s]));
  let guessesWithShow: GuessWithShow[] = [];
  guesses.forEach((guess) => {
    const show = showRecord[guess.showId];
    if (show) guessesWithShow.push({ ...guess, show });
  });
  return guessesWithShow;
};

export const guessEditForbiddenReason = (user: User, show: ShowWithVenue): string | null => {
  // allow admins to edit previous shows
  if (user.admin) return null;
  const timezone = show.venue.tz_id;
  const nowInZone = moment().tz(timezone);
  const showTimeInZone = moment(show.timestamp).tz(timezone);
  // check if current time is past show start time
  if (nowInZone > showTimeInZone) {
    if (nowInZone.format('YYYY-MM-DD') === showTimeInZone.format('YYYY-MM-DD')) {
      const startTime = formatShowDate(show, 'h:mm a z');
      return `This show has already started! According to our records, the show started at ${startTime}`;
    } else {
      return 'This show has already happened! You can only add guesses for upcoming shows.';
    }
  }
  return null;
};
