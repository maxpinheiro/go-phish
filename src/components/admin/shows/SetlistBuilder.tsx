import { scoreGuessesForShow } from '@/client/guess.client';
import { getSetlistForDate } from '@/client/setlist.client';
import SongInput from '@/components/guesses/SongInput';
import CheckboxInput from '@/components/shared/CheckboxInput';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import CloseIcon from '@/media/CloseIcon.svg';
import { ShowWithVenueAndRun } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { DateString, ResponseStatus, SetlistSong } from '@/types/main';
import { formatShowDate } from '@/utils/show.util';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface SetlistBuilderProps {
  show: ShowWithVenueAndRun;
}

// input for manually submitting
interface ManualSetlistBuilderProps {
  selectSong: (songId: string, name: string, encore: boolean) => void;
}

const ManualSetlistBuilder: React.FC<ManualSetlistBuilderProps> = ({ selectSong }) => {
  const [encore, setEncore] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center w-full my-4">
        <div className="w-full">
          <SongInput selectSong={(song) => selectSong(song.id, song.name, encore)} selectedSong={null} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <p className="">Encore: </p>
        <CheckboxInput checked={encore} onToggle={() => setEncore((b) => !b)} />
      </div>
    </>
  );
};

const SongSetlist = ({
  songs,
  deleteSong,
  color,
}: {
  songs: SetlistSong[];
  deleteSong: (id: string) => void;
  color: string;
}) => (
  <div
    className={`flex flex-col items-center space-y-1 w-full min-h-12 bg-${color} bg-opacity-10 px-4 py-4 rounded-lg border border-${color}`}
  >
    {songs.length ? (
      songs.map((song, idx) => (
        <div key={idx} className="flex justify-between w-full space-x-2">
          <p>{idx + 1}.</p>
          <p className="flex-1">
            {song.name} {song.encore ? ' (e)' : ''}
          </p>
          <div className="cursor-pointer h-4 my-auto" onClick={() => deleteSong(song.id)}>
            <CloseIcon width={18} height={18} className={`text-${color}`} />
          </div>
        </div>
      ))
    ) : (
      <p className="w-full text-left">1.</p>
    )}
  </div>
);

const SetlistBuilder: React.FC<SetlistBuilderProps> = ({ show }) => {
  const { color } = useThemeContext();
  const [setlist, setSetList] = useState<SetlistSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [scoredShows, setScoredShows] = useState(false);
  const [buildManually, setBuildManually] = useState(false);

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
    <div className="flex flex-col items-center w-full max-w-500 mx-auto">
      {scoredShows ? (
        <div className="flex flex-col items-center my-4">
          <p className="my-4">Successfully scored guesses.</p>
          <Link href={`/scores/run/${show.run.slug}?night=${show.runNight || ''}`}>View Leaderboard</Link>
        </div>
      ) : (
        <>
          {buildManually && <ManualSetlistBuilder selectSong={selectSong} />}
          <SongSetlist songs={setlist} deleteSong={deleteSong} color={color} />
          <div className="flex flex-col items-center w-full mt-10 mb-10 space-y-5">
            <button
              className={`w-full border border-${color} rounded-lg text-${color} py-2 rounded-lg`}
              onClick={fetchSetlist}
            >
              Fetch Setlist
            </button>
            <button
              className={`w-full border border-${color} rounded-lg text-${color} py-2 rounded-lg`}
              onClick={() => setBuildManually((b) => !b)}
            >
              {buildManually ? 'Disable Manual Input' : 'Enter Songs Manually'}
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
