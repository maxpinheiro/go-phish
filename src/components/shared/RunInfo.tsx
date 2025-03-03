import React from 'react';

import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import { dateToDateString, formatDateRange } from '@/utils/date.util';
import { formatShowDate } from '@/utils/show.util';

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
  large?: boolean;
  showLinks?: boolean;
}

export const ShowInfo: React.FC<ShowInfoProps> = ({ run, show, large = false, showLinks = false }) => {
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
