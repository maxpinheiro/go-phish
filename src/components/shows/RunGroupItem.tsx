import { useThemeContext } from '@/store/theme.store';
import { ShowGroupRun } from '@/types/main';
import { formatDateRange } from '@/utils/date.util';
import React from 'react';
import ShowLinks from './ShowLinks';

/**
 * A collection of shows within a single run.
 */
interface RunGroupItemProps {
  idx: number;
  showGroup: ShowGroupRun;
  openRunId: number | string | null;
  setOpenRunId: React.Dispatch<React.SetStateAction<number | string | null>>;
  openShowId: number | 'total' | null;
  setOpenShowId: React.Dispatch<React.SetStateAction<number | 'total' | null>>;
}

const RunGroupItem: React.FC<RunGroupItemProps> = ({
  idx,
  showGroup,
  openRunId,
  setOpenRunId,
  openShowId,
  setOpenShowId,
}) => {
  const { color } = useThemeContext();

  return (
    <div
      key={`run-group-item-${idx}`}
      className={`flex flex-col items-center w-full px-10 md:px-20 ${idx === 0 && 'border-t'} border-b border-${color} ${
        openRunId === showGroup.runId ? `bg-${color} bg-opacity-15` : ''
      }`}
    >
      <div
        className="cursor-pointer"
        onClick={() => {
          setOpenRunId((runId) => (runId === showGroup.runId ? null : showGroup.runId));
          setOpenShowId(null);
        }}
      >
        <p className={`my-4 ${openRunId === showGroup.runId ? `font-medium text-${color}` : ''}`}>{`${formatDateRange(
          showGroup.runDates
        )} : ${showGroup.runName}`}</p>
      </div>
      {openRunId === showGroup.runId && (
        <div className="flex justify-center w-full flex-wrap border-box space-x-4 py-2.5 ">
          {[...showGroup.shows, null].map((show, idx) => (
            <div
              key={'rungroup' + idx}
              className={`border-b cursor-pointer pb-1 ${
                (!show && openShowId === 'total') || openShowId === show?.id ? `border-${color}` : 'border-transparent'
              }`}
              onClick={() =>
                setOpenShowId((showId) =>
                  (!show && openShowId === 'total') || showId === show?.id ? null : show?.id || 'total'
                )
              }
            >
              <p className="m-0">{show ? `Night ${show.runNight}` : 'Total'}</p>
            </div>
          ))}
        </div>
      )}
      {openRunId === showGroup.runId && openShowId && (
        <div className="flex w-full pb-3">
          <ShowLinks runId={openRunId} show={showGroup.shows.find((s) => s.id === openShowId)} />
        </div>
      )}
    </div>
  );
};

export default RunGroupItem;
