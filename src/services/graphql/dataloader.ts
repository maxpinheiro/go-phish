import DataLoader from "dataloader";

import prisma from "../db.service";
import { Guess, Run, Show, User, Venue } from "@prisma/client";

export const orderRecords = <T extends {id: number}>(records: T[], ids: readonly number[]): T[] => {
  const lookup = Object.fromEntries(records.map((record) => [record.id, record]));
  return ids.map(id => lookup[id]);
}

export const groupRecords = <T, K extends string | number>(
  records: T[],
  keys: readonly K[],
  getKey: (record: T) => K
): T[][] => {
  const groups: { [key: string]: T[] } = {};
  records.forEach(record => {
    const key = getKey(record);
    if (!groups[key as string]) groups[key as string] = [];
    groups[key as string].push(record);
  });
  return keys.map(key => groups[key as string] || []);
};

export function createLoaders() {
  return {
    userLoader: new DataLoader<number, User>(async (userIds) => {
      const users = await prisma.user.findMany({ where: { id: { in: userIds as number[] }}});
      return orderRecords(users, userIds);
    }),
    venueLoader: new DataLoader<number, Venue>(async (venueIds) => {
      const venues = await prisma.venue.findMany({ where: { id: { in: venueIds as number[] }}});
      return orderRecords(venues, venueIds);
    }),
    runLoader: new DataLoader<number, Run>(async (runIds) => {
      const runs = await prisma.run.findMany({ where: { id: { in: runIds as number[] }}});
      return orderRecords(runs, runIds);
    }),
    showLoader: new DataLoader<number, Show>(async (showIds) => {
      const shows = await prisma.show.findMany({ where: { id: { in: showIds as number[] }}});
      return orderRecords(shows, showIds);
    }),
    guessesForUserLoader: new DataLoader<number, Guess[]>(async (userIds) => {
      const guesses = await prisma.guess.findMany({ where: { userId: { in: userIds as number[] }}});
      return groupRecords(guesses, userIds, guess => guess.userId);
    }),
  };
}

export type DataLoaders = ReturnType<typeof createLoaders>;
