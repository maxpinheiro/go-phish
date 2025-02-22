import { useThemeContext } from '@/store/theme.store';
import { ShowGroupYear } from '@/types/main';
import { formatDateRange } from '@/utils/date.util';
import { formatShowDate } from '@/utils/show.util';
import React from 'react';
import ShowLinks from './ShowLinks';

interface YearGroupItemProps {
  idx: number;
  showGroup: ShowGroupYear;
  openRunId: number | string | null;
  setOpenRunId: React.Dispatch<React.SetStateAction<number | string | null>>;
  openShowId: number | 'total' | null;
  setOpenShowId: React.Dispatch<React.SetStateAction<number | 'total' | null>>;
}

const YearGroupItem: React.FC<YearGroupItemProps> = ({
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
      key={`year-run-item-${idx}`}
      className={`flex flex-col items-center w-full px-10 md:px-20 border-b border-${color} ${idx === 0 && 'border-t'} ${
        openRunId === showGroup.year ? `bg-${color} bg-opacity-15` : ''
      }`}
    >
      <div
        className="cursor-pointer"
        onClick={() => {
          setOpenRunId((runId) => (runId === showGroup.year ? null : showGroup.year));
          setOpenShowId(null);
        }}
      >
        <p className={`my-4 ${openRunId === showGroup.year ? `font-medium text-${color}` : ''}`}>{showGroup.year}</p>
      </div>
      {openRunId === showGroup.year && (
        <div className="flex flex-col items-center w-full border-box space-y-2.5 pb-4 ">
          {showGroup.showsByRun.map((runGroup, idx) => (
            <div key={`year-group-run-group-${idx}`} className="w-full flex flex-col items-center space-y-2.5">
              <div className="flex items-center space-x-2">
                <p className="font-medium">{runGroup.runName}:</p>
                <p className="font-medium">{formatDateRange(runGroup.runDates)}</p>
              </div>
              {runGroup.shows.map((show, idx) => (
                <>
                  <div
                    key={'yearshowgroup' + idx}
                    className={`border-b cursor-pointer pb-1 ${
                      openShowId === show.id ? `border-${color}` : 'border-transparent'
                    }`}
                    onClick={() => setOpenShowId((showId) => (showId === show.id ? null : show.id))}
                  >
                    <p className="m-0 text-center">
                      Night {show.runNight} - <span className="font-light">{formatShowDate(show, 'M/DD/YYYY')}</span>
                    </p>
                  </div>
                  {openRunId === showGroup.year && openShowId === show.id && (
                    <div className="flex w-full pb-3">
                      <ShowLinks runId={openRunId} show={runGroup.shows.find((s) => s.id === openShowId)} />
                    </div>
                  )}
                </>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearGroupItem;
