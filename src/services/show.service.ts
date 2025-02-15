//import { testShows } from "../testData/shows";
import { DateString, ResponseStatus } from '@/types/main';
import { Show } from '@prisma/client';
import moment from 'moment-timezone';
import superjson from 'superjson';

import { CreateShowData, ShowOrderByQuery, ShowQuery, ShowWithVenue, ShowWithVenueAndRun } from '@/models/show.model';
import prisma from '@/services/db.service';

//let shows: Show.Type[] = [...testShows];

export async function getAllShows(): Promise<Show[]> {
  const shows = await prisma.show.findMany();
  return superjson.parse<Show[]>(superjson.stringify(shows));
}

export async function getAllShowsWithVenues(): Promise<ShowWithVenue[]> {
  const shows = await prisma.show.findMany({ include: { venue: true } });
  return superjson.parse<ShowWithVenue[]>(superjson.stringify(shows));
}
export async function getAllShowsWithVenuesAndRuns(): Promise<ShowWithVenueAndRun[]> {
  const shows = await prisma.show.findMany({ include: { venue: true, run: true } });
  return superjson.parse<ShowWithVenueAndRun[]>(superjson.stringify(shows));
}

export async function getShowById(showId: number): Promise<Show | ResponseStatus.NotFound> {
  const show = await prisma.show.findUnique({ where: { id: showId } });
  if (!show) return ResponseStatus.NotFound;
  return superjson.parse<Show>(superjson.stringify(show));
}

export async function getShowWithVenue(showId: number): Promise<ShowWithVenue | ResponseStatus.NotFound> {
  const show = await prisma.show.findUnique({ where: { id: showId }, include: { venue: true } });
  if (!show) return ResponseStatus.NotFound;
  return superjson.parse<ShowWithVenue>(superjson.stringify(show));
}

export async function getShowsForRun(runId: number): Promise<Show[] | ResponseStatus.NotFound> {
  const shows = await prisma.show.findMany({ where: { runId } });
  if (shows.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<Show[]>(superjson.stringify(shows));
}

export async function getShowsForRunWithVenue(runId: number): Promise<ShowWithVenue[] | ResponseStatus.NotFound> {
  const shows = await prisma.show.findMany({ where: { runId }, include: { venue: true } });
  if (shows.length === 0) return ResponseStatus.NotFound;
  return superjson.parse<ShowWithVenue[]>(superjson.stringify(shows));
}

export const getShowsByQuery = async (query: ShowQuery, orderBy?: ShowOrderByQuery): Promise<Show[]> => {
  const shows = await prisma.show.findMany({
    orderBy: orderBy || {},
    where: { ...query },
  });
  return superjson.parse<Show[]>(superjson.stringify(shows));
};

export const getShowsWithVenueByQuery = async (
  query: ShowQuery,
  orderBy?: ShowOrderByQuery
): Promise<ShowWithVenue[]> => {
  const shows = await prisma.show.findMany({
    orderBy: orderBy || {},
    where: { ...query },
    include: { venue: true },
  });
  return superjson.parse<ShowWithVenue[]>(superjson.stringify(shows));
};

export async function getTodaysShow(): Promise<ShowWithVenueAndRun | ResponseStatus.NotFound> {
  //const today = new Date();
  //const todayStr = today.toISOString().split('T')[0] as Date;
  const timezone = moment.tz.guess(true);
  const today = moment().tz(timezone);
  const todayStr = today.format('YYYY-MM-DD') as DateString;

  const show = await prisma.show.findFirst({
    where: { date: new Date(todayStr) },
    include: { venue: true, run: true },
  });
  if (!show) return ResponseStatus.NotFound;
  return superjson.parse<ShowWithVenueAndRun>(superjson.stringify(show));
}

export async function createShow(data: CreateShowData): Promise<Show> {
  const show = await prisma.show.create({ data });
  return show;
}
