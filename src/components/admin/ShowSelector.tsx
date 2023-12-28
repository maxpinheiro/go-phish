import { ShowWithVenueAndRun } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { ShowGroupRun } from '@/types/main';
import { dateToDateString } from '@/utils/date.util';
import React from 'react';

interface ShowSelectorProps {
  shows: ShowGroupRun[];
  todayShow?: ShowWithVenueAndRun;
  selectShow: (show: ShowWithVenueAndRun) => void;
}

const ShowItem: React.FC<{ show: ShowWithVenueAndRun; select: (s: ShowWithVenueAndRun) => void }> = ({
  show,
  select,
}) => (
  <div className="w-full cursor-pointer" onClick={() => select(show)}>
    <p className="">
      {dateToDateString(show.date)} - Night {show.runNight}
    </p>
  </div>
);

const ShowSelector: React.FC<ShowSelectorProps> = ({ shows, todayShow, selectShow }) => {
  const { color } = useThemeContext();

  return (
    <div className="flex flex-col items-center max-w-500 space-y-2">
      {todayShow && (
        <div
          className={`flex flex-col items-center space-y-2 px-6 py-4 border border-${color} rounded-lg shadow-sm cursor-pointer`}
          onClick={() => selectShow(todayShow)}
        >
          <p>Today&apos;s Show:</p>
          <ShowItem show={todayShow} select={selectShow} />
        </div>
      )}
      <p className="">All Shows:</p>
      <div className="flex flex-col items-center space-y-4 pb-10">
        {shows.map((showGroup, idx) => (
          <div className="flex flex-col items-center" key={`showgroup-${idx}`}>
            <p className="font-semibold my-2">{showGroup.runName}</p>
            <div className="flex flex-col items-center space-y-2">
              {showGroup.shows.map((show) => (
                <ShowItem show={show} select={selectShow} key={`showitem${show.id}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowSelector;
