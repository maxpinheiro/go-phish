import { DateString, ResponseStatus, SetlistSong } from '@/types/main';
import CloseIcon from '@/media/CloseIcon.svg';
import React, { useState } from 'react';
import SongInput from '../guesses/SongInput';
import { toTitleCase } from '@/utils/utils';
import { Show, Song } from '@prisma/client';
import moment from 'moment-timezone';
import { dateToDateString } from '@/utils/date.util';
import { getSetlistForDate } from '@/client/setlist.client';
import { useThemeContext } from '@/store/theme.store';

interface SetlistBuilderProps {
  show: Show;
  submit: (songs: SetlistSong[]) => void;
  allSongs: Song[];
}

const SetlistBuilder: React.FC<SetlistBuilderProps> = ({ show, submit, allSongs }) => {
  const [setlist, setSetList] = useState<SetlistSong[]>([]);
  const [encore, setEncore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { color } = useThemeContext();

  const selectSong = (songId: string, name: string, encore: boolean) => {
    setSetList((list) => [...list, { id: songId, name, encore }]);
  };

  const deleteSong = (songId: string) => {
    setSetList((list) => list.filter((s) => s.id !== songId));
  };

  const fetchSetlist = () => {
    const date = dateToDateString(show.timestamp);
    getSetlistForDate(date).then((songs) => {
      if (songs === ResponseStatus.NotFound) {
        setError(`could not find setlist for date ${date}`);
      } else if (songs === ResponseStatus.UnknownError) {
        setError('unknown error');
      } else {
        setSetList(songs);
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="cursor-pointer" onClick={fetchSetlist}>
        <p className="">Fetch Setlist</p>
      </div>
      <div className="flex items-center my-3">
        <p className="mr-1">Encore: </p>
        <input type="checkbox" checked={encore} onChange={() => setEncore((b) => !b)} />
      </div>
      <div className="flex flex-col items-center w-full max-w-300">
        <div className="w-3/4">
          <SongInput
            selectSong={(song) => selectSong(song.id, song.name, encore)}
            selectedSong={null}
            allSongs={allSongs}
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-300">
        {setlist.map((song, idx) => (
          <div key={idx} className="flex justify-between w-full py-1">
            <p>{idx + 1}.</p>
            <p className="">
              {song.name} {song.encore ? ' (e)' : ''}
            </p>
            <div className="cursor-pointer" onClick={() => deleteSong(song.id)}>
              <CloseIcon width={16} height={16} className="fill-black opacity-50" />
            </div>
          </div>
        ))}
      </div>
      <button className={`cursor-pointer border-b border-${color} px-1 py-1 my-2.5`} onClick={() => submit(setlist)}>
        Submit
      </button>
    </div>
  );
};

export default SetlistBuilder;
