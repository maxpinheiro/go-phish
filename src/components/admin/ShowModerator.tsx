import { ShowWithVenueAndRun } from '@/models/show.model';
import { ShowGroupRun } from '@/types/main';
import { Song } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import BackArrow from '../shared/BackArrow';
import ShowEditor from './ShowEditor';
import ShowSelector from './ShowSelector';

interface ShowModeratorProps {
  shows: ShowGroupRun[];
  todayShow: ShowWithVenueAndRun | undefined;
  allSongs: Song[];
}

const ShowModerator: React.FC<ShowModeratorProps> = ({ shows, todayShow, allSongs }) => {
  const router = useRouter();
  const [selectedShow, setSelectedShow] = useState<ShowWithVenueAndRun | null>(null);

  const back = () => router.back();

  return (
    <div className="flex flex-col items-center w-full max-w-md px-4">
      {selectedShow ? (
        <ShowEditor show={selectedShow} allSongs={allSongs} back={() => setSelectedShow(null)} />
      ) : (
        <>
          <BackArrow
            width={16}
            height={16}
            onClick={back}
            className="cursor-pointer flex items-center justify-start w-full space-x-2 pt-4"
            svgClass="fill-black dark:fill-white"
          >
            <p className="">Admin</p>
          </BackArrow>
          <p className="text-title-regular mt-2 mb-4">Moderate Shows</p>
          <ShowSelector
            shows={shows}
            todayShow={todayShow}
            selectShow={(show) => {
              setSelectedShow(show);
            }}
          />
        </>
      )}
    </div>
  );
};

export default ShowModerator;
