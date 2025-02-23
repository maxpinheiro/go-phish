import { Prisma, Run, Show, Venue } from '@prisma/client';

export type ShowQuery = Prisma.ShowWhereInput;

export type ShowOrderByQuery = Prisma.Enumerable<Prisma.ShowOrderByWithRelationInput>;

export type ShowWithVenue = Show & {
  venue: Venue;
};

export type ShowWithVenueAndRun = ShowWithVenue & {
  run: Run;
};

const showFields = ['runId', 'runNight', 'slug', 'date', 'timestamp', 'venueId'];

export const isShow = (obj: Object): obj is Show => showFields.every((f) => obj.hasOwnProperty(f));
