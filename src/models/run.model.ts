import { Prisma, Run, Venue } from '@prisma/client';

export type RunQuery = Prisma.RunWhereInput;

export type RunOrderByQuery = Prisma.Enumerable<Prisma.RunOrderByWithRelationInput>;

export type RunWithISODates = Omit<Run, 'dates'> & {
  dates: string[];
};

export const buildRunWithISODates = (run: Run): RunWithISODates => ({
  ...run,
  dates: run.dates.map((d) => d.toISOString()),
});

export const buildRunFromISODates = (run: RunWithISODates): Run => ({
  ...run,
  dates: run.dates.map((d) => new Date(d)),
});

export type RunWithVenue = Run & {
  venue: Venue;
};

const runFields = ['name', 'slug', 'dates', 'venueId'];

export const isRun = (obj: Object): obj is Run => runFields.every((f) => obj.hasOwnProperty(f));
