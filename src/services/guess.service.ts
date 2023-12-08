import { ResponseStatus } from '@/types/main';
import { Guess } from '@prisma/client';
import prisma from '@/services/db.service';
import { parseObj } from '@/utils/utils';
import superjson from 'superjson';

export async function getAllGuesses(): Promise<Guess[]> {
  const guesses = await prisma.guess.findMany();
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getGuessById(guessId: number): Promise<Guess | ResponseStatus.NotFound> {
  const guess = await prisma.guess.findUnique({ where: { id: guessId } });
  if (!guess) return ResponseStatus.NotFound;
  return superjson.parse<Guess>(superjson.stringify(guess));
}

export async function getGuessesForShow(showId: number): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { showId } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getGuessesForShows(showIds: number[]): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { showId: { in: showIds } } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getGuessesForRun(runId: number): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { runId } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  //return JSON.parse(JSON.stringify(guesses, parseObj)) as typeof guesses;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getIncompleteGuessesForUserForRun(
  runId: number,
  userId: number,
  currentShowId?: number
): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({
    where: { runId, userId, completed: false, showId: { not: currentShowId } },
    orderBy: { showId: 'asc' },
  });
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getGuesesByQuery(query: Partial<Guess>, orderBy?: {}): Promise<Guess[]> {
  const guesses = await prisma.guess.findMany({
    orderBy: orderBy || {},
    where: query,
  });
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

// export const getUsersByQuery = async (
//   query: UpdateUserDto,
//   orderBy?: UserOrderByQuery,
// ): Promise<User[]> => {
//   const users = await prisma.user.findMany({
//     orderBy: orderBy || {},
//     where: { ...query },
//   });
//   return users;
// };

export async function getGuessesForUser(userId: number): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { userId } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getScoresForUser(userId: number): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { userId, completed: true } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getGuessesForUserForRun(
  userId: number,
  runId: number
): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { userId, runId } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function getGuessesForUserForShow(
  userId: number,
  showId: number
): Promise<Guess[] | ResponseStatus.NotFound> {
  const guesses = await prisma.guess.findMany({ where: { userId, showId } });
  //if (guesses.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Guess[]>(superjson.stringify(guesses));
}

export async function addGuess(
  userId: number,
  runId: number,
  showId: number,
  songId: string,
  songName: string,
  encore: boolean
): Promise<Guess> {
  const guess = await prisma.guess.create({
    data: { userId, runId, showId, songId, songName, encore },
  });
  return guess;
}

export async function deleteGuess(guessId: number): Promise<Guess | ResponseStatus.NotFound> {
  try {
    const guess = await prisma.guess.delete({ where: { id: guessId } });
    return guess;
  } catch (e) {
    // RecordNotFound
    console.log(e);
    return ResponseStatus.NotFound;
  }
}

export async function scoreGuesses(
  guesses: Guess[],
  songs: { id: string; encore: boolean; points: number }[]
): Promise<ResponseStatus.Success | ResponseStatus.UnknownError> {
  const setlistIds = songs.map((song) => song.id);
  return new Promise(async (resolve) => {
    for (let guess of guesses) {
      if (setlistIds.includes(guess.songId)) {
        const song = songs.find((s) => s.id === guess.songId);
        if (!song) continue;
        const correctEncore = song.encore && guess.encore;
        const points = song.points + (correctEncore ? 3 : 0);
        try {
          const guesss = await prisma.guess.findUnique({ where: { id: guess.id } });
          const newGuess = await prisma.guess.update({
            where: { id: guess.id },
            data: { points, completed: true },
          });
        } catch (e) {
          console.log(e);
          resolve(ResponseStatus.UnknownError);
        }
      }
    }
    resolve(ResponseStatus.Success);
  });
}
