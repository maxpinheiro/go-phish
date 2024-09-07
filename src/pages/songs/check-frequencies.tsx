import { scrapeSongFrequency } from '@/services/phishnet.service';
import { getAllSongs } from '@/services/song.service';
import { useThemeContext } from '@/store/theme.store';
import { ResponseStatus } from '@/types/main';
import { zip } from '@/utils/utils';
import { Song } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';

function roundHalf(num: number) {
  return Math.round(num * 2) / 2;
}

function baseLog(num: number, base: number) {
  return Math.log(num) / Math.log(base);
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z / 3));
}

interface SongCheckerProps {
  error?: string;
  //frequncies?: { song: Song; frequency: number | 'not found'; points: number }[];
  frequncies?: { song: Song; frequency: number | 'not found' }[];
  minFreq?: number;
}

export const getServerSideProps: GetServerSideProps<SongCheckerProps> = async (context) => {
  const session = await getSession(context);
  const currentUserAdmin = session?.user?.admin;
  if (!currentUserAdmin) {
    return { props: { error: 'You must be have admin priviliges to view this page!' } };
  }
  // songList.slice(0, 100).forEach(async (song) => {
  //   const freq = await scrapeSongFrequency(song);
  // })
  //const songs = songList.slice(325);
  const songList = await getAllSongs();
  const songs = songList;
  //const frequencies = await Promise.all(songs.map((song) => scrapeSongFrequency(song)));
  let frequencies: number[] = [];
  const batchSize = 20;
  let min = 1000;
  for (let i = 0; i < songs.length && frequencies.length < songs.length; i += batchSize) {
    const songBatch = songs.slice(i, i + batchSize);
    const freqs = await Promise.all(songBatch.map((song) => scrapeSongFrequency(song.id)));
    const localMin = Math.min(...freqs.filter((f) => f > 0));
    min = Math.min(localMin, min);
    frequencies.push(...freqs);
  }
  //min /= 2;
  console.dir(
    frequencies.filter((f) => f !== ResponseStatus.NotFound),
    { maxArrayLength: null }
  );
  console.log(frequencies.length);
  let songFreqs: { song: Song; frequency: number | 'not found' }[] = zip(songs, frequencies).map(([s, f]) => ({
    song: s,
    frequency: f === ResponseStatus.NotFound ? 'not found' : f,
    //points: f === ResponseStatus.NotFound ? -1 : Math.floor(f / min) - 1,
    //points: f === ResponseStatus.NotFound ? -1 : roundHalf(baseLog(f / min, 1.3) + 1),
    //points: f === ResponseStatus.NotFound ? -1 : roundHalf(sigmoid(f / min - 5) * 10),
    //points: f === ResponseStatus.NotFound ? -1 : roundHalf(sigmoid(f / min - 0.5) * 14 - 7),
  }));
  //console.log(frequencies);
  songFreqs.sort((a, b) => {
    if (a.frequency == 'not found') return -1;
    else if (b.frequency == 'not found') return 1;
    else return a.frequency - b.frequency;
  });

  return { props: { frequncies: songFreqs, minFreq: min } };
};

const printDistribution = (songFreqs: { song: Song; frequency: number | 'not found'; points: number }[]): string => {
  let pointFreqs: Record<number, number> = {};
  songFreqs.forEach(({ song, frequency, points }) => {
    if (!(points in pointFreqs)) {
      pointFreqs[points] = 0;
    }
    pointFreqs[points] = pointFreqs[points] + 1;
  });
  return Object.entries(pointFreqs)
    .sort(([pA, cA], [pB, cB]) => parseInt(pA) - parseInt(pB))
    .map(([points, count]) => `${points} -> ${count}`)
    .join(' | ');
};

const SongChecker: React.FC<SongCheckerProps> = ({ frequncies, minFreq, error }) => {
  const { color } = useThemeContext();

  if (error || !frequncies || !minFreq) return <p>Error: {error || 'unknown error'}</p>;

  let songFreqs: { song: Song; frequency: number | 'not found'; points: number }[] = frequncies.map(
    ({ song, frequency }) => ({
      song,
      frequency,
      points: frequency === 'not found' ? -1 : roundHalf(sigmoid(frequency / minFreq) * 14 - 7.25),
    })
  );

  const distrStr = printDistribution(songFreqs);

  return (
    <div className="flex flex-col mx-auto">
      <p className="my-2">Song Frequencies & Points</p>
      <p className="my-2">{distrStr}</p>
      <div className="flex flex-col space-y-2">
        {songFreqs.map(({ song, frequency, points }, idx) => (
          <div key={`song-freq-${song.id}`} className="flex items-center space-x-1">
            <p>
              {idx + 1}. {song.name}
            </p>
            <a href={`https://phish.net/song/${song.id}`}>({song.id})</a>
            <p> - {frequency} - </p>
            <p className={`text-${color}`}>{points} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongChecker;
