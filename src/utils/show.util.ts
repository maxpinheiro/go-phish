import { ShowGroupRun, ShowGroupYear, ShowGroupVenue } from '@/types/main';
import { Run, Venue } from '@prisma/client';
import { dateToDateString } from './date.util';
import { ShowWithVenue, ShowWithVenueAndRun } from '@/models/show.model';
import moment from 'moment';

export const formatShowDate = (show: ShowWithVenue, format: string): string => {
  return moment(show.timestamp).tz(show.venue.tz_id).format(format);
};

export const organizeShowsByRun = (shows: ShowWithVenueAndRun[]): ShowGroupRun[] => {
  let showsByRun: Record<number, ShowWithVenueAndRun[]> = {};
  let runsById: Record<number, Run> = {};
  shows.forEach((show) => {
    if (!(show.runId in showsByRun)) {
      showsByRun[show.runId] = [];
      runsById[show.runId] = show.run;
    }
    showsByRun[show.runId].push(show);
  });
  let showGroups: ShowGroupRun[] = [];
  for (let [runId, shows] of Object.entries(showsByRun)) {
    const run = runsById[parseInt(runId)];
    if (!run) continue;
    showGroups.push({
      runId: parseInt(runId),
      runName: run.name,
      runDates: run.dates.map((d) => dateToDateString(d)),
      shows: shows.sort((s1, s2) => new Date(s1.timestamp).getTime() - new Date(s2.timestamp).getTime()),
    });
  }
  showGroups.sort((group1, group2) => new Date(group2.runDates[0]).getTime() - new Date(group1.runDates[0]).getTime());
  return showGroups;
};

export const organizeShowsByYear = (shows: ShowWithVenueAndRun[]): ShowGroupYear[] => {
  let showsByYear: Record<number, ShowWithVenueAndRun[]> = {};
  shows.forEach((show) => {
    const year = new Date(show.timestamp).getFullYear();
    if (!(year in showsByYear)) {
      showsByYear[year] = [];
    }
    showsByYear[year].push(show);
  });
  return Object.entries(showsByYear)
    .map(([year, shows]) => ({
      year: parseInt(year),
      showsByRun: organizeShowsByRun(shows),
    }))
    .sort((a, b) => b.year - a.year);
};

export const organizeShowsByVenue = (shows: ShowWithVenueAndRun[]): ShowGroupVenue[] => {
  let showsByVenue: Record<string, ShowWithVenueAndRun[]> = {};
  let venuesById: Record<string, Venue> = {};
  shows.forEach((show) => {
    if (!(show.venue.id in showsByVenue)) {
      showsByVenue[show.venue.id] = [];
    }
    showsByVenue[show.venue.id].push(show);
    if (!(show.venue.id in venuesById)) {
      venuesById[show.venue.id] = show.venue;
    }
  });
  let showGroups: ShowGroupVenue[] = Object.entries(showsByVenue).map(([venueId, shows]) => ({
    venue: venuesById[venueId],
    showsByRun: organizeShowsByRun(shows),
  }));
  showGroups.sort((group1, group2) => group1.venue.name.charCodeAt(0) - group2.venue.name.charCodeAt(0));
  return showGroups;
};
