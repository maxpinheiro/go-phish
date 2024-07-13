import DropDownIcon from '@/media/Dropdown.svg';
import { useThemeContext } from '@/store/theme.store';
import { OrganizedRunItem } from '@/utils/guess.util';
import { toTitleCase } from '@/utils/utils';
import moment from 'moment';
import React, { useState } from 'react';
import ToggleDropdown from '../shared/ToggleDropdown';

interface RunRecordProps {
  runRecord: OrganizedRunItem[];
}

type SortType = 'date' | 'score';

const sortOptions: SortType[] = ['date', 'score'];

const recordSorter: Record<SortType, (a: OrganizedRunItem, b: OrganizedRunItem) => number> = {
  date: (a, b) => moment(b.run.dates[0]).valueOf() - moment(a.run.dates[0]).valueOf(),
  score: (a, b) => b.points - a.points,
};

const RunRecord: React.FC<RunRecordProps> = ({ runRecord: allRuns }) => {
  const [openRunId, setOpenRunId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('date');
  const runRecord: OrganizedRunItem[] = [...allRuns].sort(recordSorter[sortType]);
  const { color } = useThemeContext();

  return (
    <div className="mt-4">
      <ToggleDropdown
        key="run-record-dropdown"
        defaultOpen
        disableTextClick
        header={
          <div className="flex items-center space-x-2.5 my-1">
            <p className="font-semibold m-0">Score Record:</p>
            <div className="flex items-center space-x-2">
              {sortOptions.map((o) => (
                <div
                  key={`opt-${o}`}
                  onClick={() => setSortType(o)}
                  className={`cursor-pointer border-b ${
                    sortType === o ? 'border-black dark:border-white' : 'border-transparent'
                  }`}
                >
                  <p className="text-sm">by {o}</p>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="ml-2.5">
          {Object.values(runRecord).map(({ run, points, scores }) => (
            <div key={run.id} className="my-2.5">
              <div
                onClick={() => setOpenRunId((id) => (id === run.id ? null : run.id))}
                className="flex items-center cursor-pointer space-x-1"
              >
                <p className="m-0">
                  {run.name || ''} - <b className={`text-${color}`}>{`${points} pts`}</b>
                </p>
                <DropDownIcon
                  height={8}
                  className={`transition duration-300 fill-black dark:fill-white ${
                    openRunId === run.id ? '-rotate-180' : ''
                  }`}
                />
              </div>
              {openRunId === run.id && (
                <div className="flex flex-col items-start space-y-1 py-2.5">
                  {scores.map((score, idx) => (
                    <div key={idx} className="">
                      <p className="m-0">
                        {toTitleCase(score.songName.split('-').join(' '))} ({score.points} pt
                        {score.points > 1 ? 's' : ''})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ToggleDropdown>
    </div>
  );
};

export default RunRecord;
