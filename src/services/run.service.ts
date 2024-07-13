//import { testRuns } from "../testData/runs";
import { ResponseStatus } from '@/types/main';
import { Run } from '@prisma/client';
import superjson from 'superjson';

import { RunWithVenue } from '@/models/run.model';
import prisma from '@/services/db.service';

//let runs: Run.Type[] = [...testRuns];

export async function getAllRuns(): Promise<Run[]> {
  const runs = await prisma.run.findMany();
  return superjson.parse<Run[]>(superjson.stringify(runs));
}

export async function getAllRunsWithVenues(): Promise<RunWithVenue[]> {
  const runs = await prisma.run.findMany({ include: { venue: true } });
  return superjson.parse<RunWithVenue[]>(superjson.stringify(runs));
}

export async function getRunById(runId: number): Promise<Run | ResponseStatus.NotFound> {
  const run = await prisma.run.findUnique({ where: { id: runId } });
  return run ? superjson.parse<Run>(superjson.stringify(run)) : ResponseStatus.NotFound;
}

export async function getRunWithVenue(runId: number): Promise<RunWithVenue | ResponseStatus.NotFound> {
  const run = await prisma.run.findUnique({ where: { id: runId }, include: { venue: true } });
  return run ? superjson.parse<RunWithVenue>(superjson.stringify(run)) : ResponseStatus.NotFound;
}

export async function getRunsByIds(runIds: number[]): Promise<Run[] | ResponseStatus.NotFound> {
  if (runIds.length === 0) return [];

  const runs = await prisma.run.findMany({ where: { id: { in: runIds } } });
  return runs.length > 0 ? superjson.parse<Run[]>(superjson.stringify(runs)) : ResponseStatus.NotFound;
}

/*
export async function getCurrentRun(): Promise<Run.Type | undefined> {
    return new Promise((resolve, reject) => {setTimeout(() => {
        const dateObj = new Date();
        const date: Date = `${dateObj.getUTCMonth() + 1}-${dateObj.getUTCDate()}-${dateObj.getUTCFullYear()}`;
        resolve(runs.find(run => run.dates.includes(date)));
    }, 1000)});
}
*/
