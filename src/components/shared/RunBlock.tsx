import React from 'react';
import { RunWithVenue } from '@/models/run.model';
import { Show } from '@prisma/client';
import ShowLinks from '../shows/ShowLinks';
import { useThemeContext } from '@/store/theme.store';

interface RunBlockProps {
  run: RunWithVenue;
  showLocation?: boolean;
  currentShow?: Show | undefined;
  showLinks?: boolean;
}

const RunBlock: React.FC<RunBlockProps> = ({ run, showLocation = true, showLinks = true, currentShow = undefined }) => {
  const { color } = useThemeContext();

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
        <div className={`text-${color} w-full px-4`}>
          <ShowLinks runId={run.id} show={currentShow} />
        </div>
      )}
    </div>
  );
};

export default RunBlock;
