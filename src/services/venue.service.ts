import prisma from '@/services/db.service';
import { Venue } from '@prisma/client';

export async function getAllVenues(): Promise<Venue[]> {
  const venues = await prisma.venue.findMany();
  return venues;
}
