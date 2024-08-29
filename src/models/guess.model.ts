import { Guess, Prisma, Show } from '@prisma/client';

export type GuessQuery = Prisma.GuessWhereInput;

export type GuessOrderByQuery = Prisma.Enumerable<Prisma.GuessOrderByWithRelationInput>;

export type GuessWithShow = Guess & {
  show: Show;
};
