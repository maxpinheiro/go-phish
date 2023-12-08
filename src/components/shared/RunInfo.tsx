import React from 'react';

import { dateToDateString, dateToString, formatDateRange } from '@/utils/date.util';
import { Run, Show } from '@prisma/client';
import { formatShowDate } from '@/utils/show.util';
import { ShowWithVenue } from '@/models/show.model';
import { RunWithVenue } from '@/models/run.model';

interface RunInfoProps {
  run: RunWithVenue;
  large?: boolean;
  showLocation?: boolean;
}

export const RunInfo: React.FC<RunInfoProps> = ({ run, large = false, showLocation = false }) => (
  <div className="flex flex-col items-center" id="run-info">
    <p className={`mb-2.5 ${large ? 'text-3xl' : 'text-xl'}`}>{run.name}</p>
    <p className="">
      {formatDateRange(
        run.dates.map((d) => dateToDateString(d)),
        true
      )}
    </p>
    {showLocation && (
      <p className="mt-2">
        {run.venue.city}, {run.venue.state || run.venue.country}
      </p>
    )}
  </div>
);

interface ShowInfoProps {
  run: RunWithVenue;
  show: ShowWithVenue;
  runShows: ShowWithVenue[];
  large?: boolean;
  showLinks?: boolean;
}

export const ShowInfo: React.FC<ShowInfoProps> = ({ run, show, runShows, large = false, showLinks = false }) => {
  const prevShow = runShows.find((s) => s.runNight === show.runNight - 1);
  const nextShow = runShows.find((s) => s.runNight === show.runNight + 1);
  return (
    <div className="flex flex-col items-center" id="run-info">
      <p className={`mt-0 mb-2.5 ${large ? 'text-3xl' : 'text-xl'}`}>{run.name}</p>
      <p className="m-0">
        Night {show.runNight} - {formatShowDate(show, 'ddd, MMM Do YYYY')}
      </p>
      {showLinks && <div className="flex items-center"></div>}
    </div>
  );
};
