import { Prisma, Run, Venue } from '@prisma/client';

export type RunQuery = Prisma.RunWhereInput;

export type RunOrderByQuery = Prisma.Enumerable<Prisma.RunOrderByWithRelationInput>;

export type RunWithVenue = Run & {
  venue: Venue;
};
