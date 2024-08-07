import { scoreGuessesForShow } from '@/client/guess.client';
import { getSetlistForDate } from '@/client/setlist.client';
import CloseIcon from '@/media/CloseIcon.svg';
import { ShowWithVenueAndRun } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { DateString, ResponseStatus, SetlistSong } from '@/types/main';
import { formatShowDate } from '@/utils/show.util';
import { Song } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SongInput from '../guesses/SongInput';
import CheckboxInput from '../shared/CheckboxInput';
import LoadingOverlay from '../shared/LoadingOverlay';

interface SetlistBuilderProps {
  show: ShowWithVenueAndRun;
  allSongs: Song[];
}

const SetlistBuilder: React.FC<SetlistBuilderProps> = ({ show, allSongs }) => {
  const [setlist, setSetList] = useState<SetlistSong[]>([]);
  const [encore, setEncore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoredShows, setScoredShows] = useState(false);
  const { color } = useThemeContext();

  const selectSong = (songId: string, name: string, encore: boolean) => {
    setSetList((list) => [...list, { id: songId, name, encore }]);
  };

  const deleteSong = (songId: string) => {
    setSetList((list) => list.filter((s) => s.id !== songId));
  };

  const fetchSetlist = async () => {
    const date = formatShowDate(show, 'YYYY-MM-DD') as DateString;
    setLoading(true);
    const songs = await getSetlistForDate(date);
    if (songs === ResponseStatus.NotFound) {
      toast.error(`Could not find setlist for date ${date}`, { duration: 3000 });
    } else if (songs === ResponseStatus.UnknownError) {
      toast.error('An unknown error occurred', { duration: 3000 });
    } else {
      setSetList(songs);
    }
    setLoading(false);
  };

  const submitSongs = async (songs: SetlistSong[]) => {
    setLoading(true);
    const res = await scoreGuessesForShow(show.id, songs);
    if (res === ResponseStatus.Success) {
      setScoredShows(true);
    } else {
      toast.error('An unknown error occurred while scoring guesses.', { duration: 5000 });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {scoredShows ? (
        <div className="flex flex-col items-center my-4">
          <p className="my-4">Successfully scored guesses.</p>
          <Link href={`/scores/run/${show.runId}?night=${show.runNight || ''}`}>View Leaderboard</Link>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <p className="">Encore: </p>
            <CheckboxInput checked={encore} onToggle={() => setEncore((b) => !b)} />
          </div>
          <div className="flex flex-col items-center w-full my-4">
            <div className="w-full">
              <SongInput
                selectSong={(song) => selectSong(song.id, song.name, encore)}
                selectedSong={null}
                allSongs={allSongs}
              />
            </div>
          </div>
          <div className="flex flex-col items-center w-full px-2">
            {setlist.map((song, idx) => (
              <div key={idx} className="flex justify-between w-full py-1 space-x-2">
                <p>{idx + 1}.</p>
                <p className="flex-1">
                  {song.name} {song.encore ? ' (e)' : ''}
                </p>
                <div className="cursor-pointer" onClick={() => deleteSong(song.id)}>
                  <CloseIcon width={16} height={16} className="fill-black opacity-50" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center w-full mt-10 mb-10 space-y-4">
            <button
              className={`w-full border border-${color} rounded-lg text-${color} py-2 rounded-lg`}
              onClick={fetchSetlist}
            >
              Fetch Setlist
            </button>
            <button className={`w-full bg-${color} text-white py-2 rounded-lg`} onClick={() => submitSongs(setlist)}>
              Submit
            </button>
          </div>
        </>
      )}
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default SetlistBuilder;
