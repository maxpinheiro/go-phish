import { ShowWithVenue } from '@/models/show.model';
import { dateToDateString } from '@/utils/date.util';
import { Show } from '@prisma/client';
import React from 'react';

interface ShowSelectorProps {
  shows: ShowWithVenue[];
  todayShow?: ShowWithVenue;
  selectShow: (show: ShowWithVenue) => void;
}

const ShowItem: React.FC<{ show: ShowWithVenue; select: (s: ShowWithVenue) => void }> = ({ show, select }) => (
  <div className="w-full cursor-pointer" onClick={() => select(show)}>
    <p className="">
      {dateToDateString(show.date)} - {show.venue.name}, Night {show.runNight}
    </p>
  </div>
);

const ShowSelector: React.FC<ShowSelectorProps> = ({ shows, todayShow, selectShow }) => (
  <div className="flex flex-col items-center max-w-500 space-y-2">
    <p className="mt-4">Select a Show:</p>
    {todayShow && (
      <div className="flex flex-col items-center space-x-2">
        <p>Today&apos;s Show:</p>
        <ShowItem show={todayShow} select={selectShow} />
      </div>
    )}
    {shows.map((show, idx) => (
      <ShowItem show={show} select={selectShow} key={`showitem${idx}`} />
    ))}
  </div>
);

export default ShowSelector;
