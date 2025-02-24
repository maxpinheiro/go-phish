import { Prisma, Run, Show, Venue } from '@prisma/client';

export type ShowQuery = Prisma.ShowWhereInput;

export type ShowOrderByQuery = Prisma.Enumerable<Prisma.ShowOrderByWithRelationInput>;

export type ShowWithISODates = Omit<Show, 'date' | 'timestamp'> & {
  date: string;
  timestamp: string;
};

export type ShowWithVenue = Show & {
  venue: Venue;
};

export type ShowWithRun = Show & {
  run: Run;
};

export type ShowWithVenueAndRun = ShowWithVenue & {
  run: Run;
};

export type ShowIdAndRunNight = Pick<Show, 'id' | 'runNight'>;

const showFields = ['runId', 'runNight', 'slug', 'date', 'timestamp', 'venueId'];

export const isShow = (obj: Object): obj is Show => showFields.every((f) => obj.hasOwnProperty(f));
