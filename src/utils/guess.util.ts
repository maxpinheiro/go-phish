import { PreviousGuess } from '@/components/guesses/GuessSelectorModal';
import { GuessWithShow } from '@/models/guess.model';
import { Guess, Run, Show, User } from '@prisma/client';
import { guessSorter } from './utils';

export type OrganizedRunItem = { run: Run; points: number; scores: Guess[] };

export const organizeRunRecord = (guessesByRun: Record<number, Guess[]>, runs: Run[]): OrganizedRunItem[] => {
  let runRecord: OrganizedRunItem[] = [];
  Object.entries(guessesByRun).forEach(([runId, guesses]) => {
    const run = runs.find((r) => r.id === parseInt(runId));
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

export type OrganizedGuesses = {
  user: User;
  guesses: { complete: Guess[]; incomplete: Guess[] };
}[];

export type OrganizedGuessesWithShow = {
  user: User;
  guesses: { complete: GuessWithShow[]; incomplete: GuessWithShow[] };
}[];

export const organizeGuessesByUser = (guessesByUser: Record<number, Guess[]>, users: User[]): OrganizedGuesses => {
  let organizedGuesses: OrganizedGuesses = [];

  Object.entries(guessesByUser).forEach(([userId, guesses]) => {
    const user = users.find((u) => u.id === parseInt(userId));
    if (!user) return;
    let guessDict: { complete: Guess[]; incomplete: Guess[] } = { complete: [], incomplete: [] };
    guesses.sort(guessSorter);
    const pivot = guesses.findIndex((guess) => !guess.completed);
    if (pivot >= 0) {
      guessDict.complete = guesses.slice(0, pivot);
      guessDict.incomplete = guesses.slice(pivot);
    } else {
      // no pivot -> all completed
      guessDict.complete = guesses;
    }
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
