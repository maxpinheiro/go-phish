import { Prisma, Venue } from '@prisma/client';

export type VenueQuery = Prisma.VenueWhereInput;

export type CreateVenueData = Omit<Venue, 'id'>;
