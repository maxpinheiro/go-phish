import { Prisma, Run, Show, Venue } from '@prisma/client';

export type ShowQuery = Prisma.ShowWhereInput;

export type ShowOrderByQuery = Prisma.Enumerable<Prisma.ShowOrderByWithRelationInput>;

export type ShowWithVenue = Show & {
  venue: Venue;
};

export type ShowWithVenueAndRun = ShowWithVenue & {
  run: Run;
};

export type CreateShowData = Omit<Show, 'id'>;
