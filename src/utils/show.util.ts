import { RadioOption } from '@/components/shared/RadioGroup';
import { ShowWithVenue, ShowWithVenueAndRun } from '@/models/show.model';
import { ShowGroupRun, ShowGroupVenue, ShowGroupYear } from '@/types/main';
import { Run, Show, Venue } from '@prisma/client';
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
      run,
      shows: shows.sort((s1, s2) => new Date(s1.timestamp).getTime() - new Date(s2.timestamp).getTime()),
    });
  }
  showGroups.sort((group1, group2) => group2.run.dates[0].getTime() - group1.run.dates[0].getTime());
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

export const nightShowsRadioOptions = (shows: Show[], includeTotal = true): RadioOption[] => {
  const nightOptions: RadioOption[] = shows
    .map((show) => show.runNight)
    .sort()
    .map((nightNumber) => ({
      value: nightNumber,
      label: `Night ${nightNumber}`,
    }));
  return includeTotal ? nightOptions.concat([{ value: 'total', label: 'Total' }]) : nightOptions;
};
