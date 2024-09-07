import prisma from '@/services/db.service';
import { scrapeSongFrequency } from '@/services/phishnet.service';
import { getAllSongs } from '@/services/song.service';
import { songPointsByFrequency } from '@/utils/score.util';
import { Song } from '@prisma/client';
import _ from 'lodash';

const updateSongScores = async () => {
  const songs = await getAllSongs();
  const songFrequencies = await Promise.all(songs.map((s) => scrapeSongFrequency(s.id)));
  const songScores = songFrequencies.map((freq) => songPointsByFrequency(freq));
  const songInfo = _.zip(songs, songFrequencies, songScores) as [Song, number, number][];
  const updatedSongs = songInfo.filter(([song, _, score]) => song?.points !== score);

  if (updatedSongs.length === 0) {
    console.log('No songs to update.');
    return;
  }

  console.log(`Songs to update (${updatedSongs.length}):`);
  updatedSongs.forEach(([{ name, averageGap, points }, freq, pts]) =>
    console.log(`${name} ${pts > points ? '(↑)' : '(↓)'}: ${averageGap} (${points} pts) => ${freq} (${pts} pts)`)
  );

  const updateSong = (songId: string, averageGap: number, points: number) =>
    prisma.song.update({
      where: { id: songId },
      data: { averageGap, points },
    });
  const updates = updatedSongs.map(([song, freq, points]) => updateSong(song.id, freq, points));
  await prisma.$transaction(updates);
  console.log(`Successfully updated ${updatedSongs.length} songs`);
};

updateSongScores();
