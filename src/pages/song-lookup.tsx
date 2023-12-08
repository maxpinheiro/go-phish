import SongInput from '@/components/guesses/SongInput';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getSongById } from '@/services/phishnet.service';
import { getAllSongs } from '@/services/song.service';
import { useThemeContext } from '@/store/theme.store';
import { PhishNetSong, ResponseStatus } from '@/types/main';
import { Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

interface SongLookupPageProps {
  allSongs: Song[];
}

export const getServerSideProps: GetServerSideProps<SongLookupPageProps> = async () => {
  const allSongs = await getAllSongs();
  return {
    props: { allSongs },
  };
};

/**
 * 
 <p className="">Last Played: {songData.last_played}</p>
          <p className="">Debut: {songData.debut}</p>
          <p className="">Times Played: {songData.times_played}</p>
          <p className="">Current Gap: {songData.gap}</p>
          <p className="">Average Gap: {selectedSong.averageGap}</p>
          <p className="">Points: {selectedSong.points}</p>
 */
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

const SongLookupPage: React.FC<SongLookupPageProps> = ({ allSongs }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loaded');
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [songData, setSongData] = useState<PhishNetSong | null>(null);
  const { color } = useThemeContext();

  const alertError = (errorMsg: string) => {
    setStatus('error');
    setError(errorMsg);
    setTimeout(() => {
      setStatus('loaded');
      setError(null);
    }, 5000);
  };

  const selectSong = async (song: Song) => {
    setStatus('loading');
    const songData = await getSongById(song.id);
    if (songData === ResponseStatus.UnknownError) {
      return alertError('Could not find song data.');
    }
    console.log(songData);
    setSongData(songData);
    setSelectedSong(song);
    setStatus('loaded');
  };

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Song Lookup | Go Phish</title>
      </Head>
      <p className="text-title-regular my-5">Song Lookup</p>
      <div className="w-3/4 mb-5">
        <SongInput allSongs={allSongs} selectSong={selectSong} selectedSong={null} />
      </div>
      {status === 'loading' && <LoadingSpinner />}
      {status === 'loaded' && songData && selectedSong && (
        <div className={`w-3/4 flex flex-col items-center border border-${color} rounded-lg px-5 py-4 space-y-2`}>
          <p className="text-xl font-regular">{songData.name}</p>
          <SongInfoList song={selectedSong} data={songData} />
        </div>
      )}
    </div>
  );
};

export default SongLookupPage;
