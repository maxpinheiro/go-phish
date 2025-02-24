import SongInput from '@/components/guesses/SongInput';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { getSongById } from '@/services/phishnet.service';
import { useThemeContext } from '@/store/theme.store';
import { PhishNetSong, ResponseStatus } from '@/types/main';
import { Song } from '@prisma/client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const songInfoList = (song: Song, data: PhishNetSong): { label: string; value: string | number }[] => [
  { label: 'Last Played:', value: data.last_played },
  { label: 'Debut:', value: data.debut },
  { label: 'Times Played:', value: data.times_played },
  { label: 'Current Gap:', value: data.gap },
  { label: 'Average Gap:', value: song.averageGap },
  { label: 'Points:', value: song.points },
];

const SongInfoList = ({ song, data }: { song: Song; data: PhishNetSong }) => (
  <>
    {songInfoList(song, data).map(({ label, value }, idx) => (
      <div className="flex w-full items-center" key={`songinfo-${idx}`}>
        <p className="w-1/2 font-medium text-right mr-2">{label}</p>
        <p className="flex flex-1">{value}</p>
      </div>
    ))}
  </>
);

const SongLookupContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [songData, setSongData] = useState<PhishNetSong | null>(null);
  const { color } = useThemeContext();

  const alertError = (errorMsg: string) => {
    toast.error(errorMsg, { duration: 3000 });
  };

  const selectSong = async (song: Song) => {
    setLoading(true);
    const songData = await getSongById(song.id);
    if (songData === ResponseStatus.UnknownError) {
      alertError('Could not find song data.');
      setLoading(false);
      return;
    }
    setSongData(songData);
    setSelectedSong(song);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-title-regular my-5">Song Lookup</p>
      <div className="w-3/4 mb-5">
        <SongInput selectSong={selectSong} selectedSong={null} />
      </div>
      {loading && <LoadingOverlay />}
      {songData && selectedSong && (
        <div className={`w-3/4 flex flex-col items-center border border-${color} rounded-lg px-5 py-4 space-y-2`}>
          <p className="text-xl font-regular">{songData.name}</p>
          <SongInfoList song={selectedSong} data={songData} />
        </div>
      )}
    </div>
  );
};

export default SongLookupContainer;
