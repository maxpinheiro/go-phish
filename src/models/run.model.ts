import { Prisma, Run, Venue } from '@prisma/client';

export type RunQuery = Prisma.RunWhereInput;

export type RunOrderByQuery = Prisma.Enumerable<Prisma.RunOrderByWithRelationInput>;

export type RunWithISODates = Omit<Run, 'dates'> & {
  dates: string[];
};

export type RunWithVenue = Run & {
  venue: Venue;
};

const runFields = ['name', 'slug', 'dates', 'venueId'];

export const isRun = (obj: Object): obj is Run => runFields.every((f) => obj.hasOwnProperty(f));
