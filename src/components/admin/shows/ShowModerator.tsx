import { ShowWithVenueAndRun } from '@/models/show.model';
import { selectSelectedShow, setSelectedShow } from '@/store/admin/showModerator.store';
import { ShowGroupRun } from '@/types/main';
import { Song } from '@prisma/client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import ShowEditor from './ShowEditor';
import ShowSelector from './ShowSelector';

interface ShowModeratorProps {
  shows: ShowGroupRun[];
  todayShow: ShowWithVenueAndRun | undefined;
  allSongs: Song[];
}

const ShowModerator: React.FC<ShowModeratorProps> = ({ shows, todayShow, allSongs }) => {
  const dispatch = useDispatch();
  const selectedShow = useSelector(selectSelectedShow);
  const selectShow = (show: ShowWithVenueAndRun | null) => dispatch(setSelectedShow(show));

  return (
    <div className="flex flex-col items-center w-full">
      {selectedShow ? (
        <ShowEditor show={selectedShow} allSongs={allSongs} />
      ) : (
        <ShowSelector shows={shows} todayShow={todayShow} selectShow={selectShow} />
      )}
    </div>
  );
};

export const ShowModeratorSkeleton = () => (
  <div className="flex flex-col items-center min-w-52 mx-auto">
    <Skeleton height={96} containerClassName="w-full rounded-lg shadow-sm" />
    <div className="h-4" />
    <Skeleton height={24} count={10} containerClassName="w-full space-y-4" />
  </div>
);

export default ShowModerator;
