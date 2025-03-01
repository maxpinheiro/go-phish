import { RunWithVenue } from '@/models/run.model';
import { useThemeContext } from '@/store/theme.store';
import { formatShowDate } from '@/utils/show.util';
import { Show } from '@prisma/client';
import React from 'react';
import RunShowLinks from '../shows/RunShowLinks';

interface RunBlockProps {
  run: RunWithVenue;
  currentShow: Show;
  showLocation?: boolean;
  showLinks?: boolean;
  showStartTime?: boolean;
}

const RunBlock: React.FC<RunBlockProps> = ({
  run,
  currentShow,
  showLocation = true,
  showLinks = true,
  showStartTime = true,
}) => {
  const { color } = useThemeContext();
  const startTime = currentShow && formatShowDate({ ...currentShow, venue: run.venue }, 'h:mm a z');

  return (
    <div
      className={`flex flex-col items-center space-y-2 rounded-lg border border-${color} w-5/6 max-w-[400px] px-2.5 py-4 shadow-md`}
      id={`run-block-${run.id}`}
    >
      <p className="text-2xl font-medium">{run.name}</p>
      {currentShow !== undefined && (
        <p className={`px-2 pb-1 border-b border-${color} text-sm`}>
          Night {currentShow.runNight}/{run.dates.length}
        </p>
      )}
      <p className="font-medium">{run.venue.name}</p>
      {showLocation && (
        <p className="mt-2 text-sm">
          {run.venue.city}, {run.venue.state || run.venue.country}
        </p>
      )}
      {showLinks && (
        <div className={`text-${color} w-full px-10 md:px-4`}>
          <RunShowLinks run={run} show={currentShow} />
        </div>
      )}
      {showStartTime && <p className="opacity-50 pb-2">Show starts at {startTime}</p>}
    </div>
  );
};

export default RunBlock;
