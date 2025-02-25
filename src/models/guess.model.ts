import { Guess, Prisma, Show, User } from '@prisma/client';

export type GuessQuery = Prisma.GuessWhereInput;

export type GuessOrderByQuery = Prisma.Enumerable<Prisma.GuessOrderByWithRelationInput>;

export type GuessWithShow = Guess & {
  show: Show;
};

export type GuessWithShowAndUser = GuessWithShow & {
  user: User;
};

const guessFields = ['userId', 'songId', 'songName', 'showId', 'runId', 'encore', 'completed', 'points'];

export const isGuess = (obj: Object): obj is Guess => guessFields.every((f) => obj.hasOwnProperty(f));
