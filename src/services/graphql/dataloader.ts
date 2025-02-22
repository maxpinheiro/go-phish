import DataLoader from 'dataloader';

import { Guess, Run, Show, User, Venue } from '@prisma/client';
import prisma from '../db.service';

export const orderRecords = <T extends { id: number }>(records: T[], ids: readonly number[]): T[] => {
  const lookup = Object.fromEntries(records.map((record) => [record.id, record]));
  return ids.map((id) => lookup[id]);
};

export const groupRecords = <T, K extends string | number>(
  records: T[],
  keys: readonly K[],
  getKey: (record: T) => K
): T[][] => {
  const groups: { [key: string]: T[] } = {};
  records.forEach((record) => {
    const key = getKey(record);
    if (!groups[key as string]) groups[key as string] = [];
    groups[key as string].push(record);
  });
  return keys.map((key) => groups[key as string] || []);
};

export function createLoaders() {
  return {
    userLoader: new DataLoader<number, User>(async (userIds) => {
      console.info(`Loading users: [${userIds.join(', ')}]`);
      const users = await prisma.user.findMany({ where: { id: { in: userIds as number[] } } });
      return orderRecords(users, userIds);
    }),
    venueLoader: new DataLoader<number, Venue>(async (venueIds) => {
      console.info(`Loading venues: [${venueIds.join(', ')}]`);
      const venues = await prisma.venue.findMany({ where: { id: { in: venueIds as number[] } } });
      return orderRecords(venues, venueIds);
    }),
    runLoader: new DataLoader<number, Run>(async (runIds) => {
      console.info(`Loading runs: [${runIds.join(', ')}]`);
      const runs = await prisma.run.findMany({ where: { id: { in: runIds as number[] } } });
      return orderRecords(runs, runIds);
    }),
    showLoader: new DataLoader<number, Show>(async (showIds) => {
      console.info(`Loading shows: [${showIds.join(', ')}]`);
      const shows = await prisma.show.findMany({ where: { id: { in: showIds as number[] } } });
      return orderRecords(shows, showIds);
    }),
    guessesForUserLoader: new DataLoader<number, Guess[]>(async (userIds) => {
      console.info(`Loading guesses for users: [${userIds.join(', ')}]`);
      const guesses = await prisma.guess.findMany({ where: { userId: { in: userIds as number[] } } });
      return groupRecords(guesses, userIds, (guess) => guess.userId);
    }),
    guessesForRunLoader: new DataLoader<number, Guess[]>(async (runIds) => {
      console.info(`Loading guesses for runs: [${runIds.join(', ')}]`);
      const guesses = await prisma.guess.findMany({ where: { runId: { in: runIds as number[] } } });
      return groupRecords(guesses, runIds, (guess) => guess.runId);
    }),
    runsForVenueLoader: new DataLoader<number, Run[]>(async (venueIds) => {
      console.info(`Loading runs for venues: [${venueIds.join(', ')}]`);
      const runs = await prisma.run.findMany({ where: { venueId: { in: venueIds as number[] } } });
      return groupRecords(runs, venueIds, (run) => run.venueId);
    }),
    showsForVenueLoader: new DataLoader<number, Show[]>(async (venueIds) => {
      console.info(`Loading shows for venues: [${venueIds.join(', ')}]`);
      const shows = await prisma.show.findMany({ where: { venueId: { in: venueIds as number[] } } });
      return groupRecords(shows, venueIds, (show) => show.venueId);
    }),
    showsForRunLoader: new DataLoader<number, Show[]>(async (runIds) => {
      console.info(`Loading shows for runs: [${runIds.join(', ')}]`);
      const shows = await prisma.show.findMany({ where: { runId: { in: runIds as number[] } } });
      return groupRecords(shows, runIds, (show) => show.runId);
    }),
  };
}

export type DataLoaders = ReturnType<typeof createLoaders>;
