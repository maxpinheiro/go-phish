import { getAllSongs as getAllPhishNetSongs } from '@/services/phishnet.service';
import { getAllSongs } from '@/services/song.service';
import { ResponseStatus } from '@/types/main';
import { toTitleCase } from '@/utils/utils';
import { difference } from 'lodash';

const crosslistSongs = async () => {
  const localSongs = await getAllSongs();
  let apiSongs = await getAllPhishNetSongs();
  if (apiSongs === ResponseStatus.UnknownError) {
    return;
  }
  const allowedArtists = [
    'Trey Anastasio',
    'Trey Anastasio & Don Hart',
    'Trey, Mike, and The Benevento/Russo Duo',
    'Phish',
    'Mike Gordon',
    'Mike Gordon and Leo Kottke',
    'Ghosts of the Forest',
    'Page Mcconnell',
    'Page McConnell',
  ];
  apiSongs = apiSongs.filter((s) => allowedArtists.includes(s.artist));

  apiSongs.sort((a, b) => a.name.localeCompare(b.name));
  localSongs.sort((a, b) => a.name.localeCompare(b.name));
  console.log(`${apiSongs.length} API Songs / ${localSongs.length} DB Songs`);

  const apiSongNames = apiSongs.map((s) => toTitleCase(s.name.toLowerCase().replace(/[,'\(\)\.]/g, '')));
  const localSongNames = localSongs.map((s) => toTitleCase(s.name.toLowerCase().replace(/[,'\(\)\.]/g, '')));

  // let missingLocalSongNames = Array.from(setDifference(apiSongNames, localSongNames));
  let missingLocalSongNames = difference(apiSongNames, localSongNames);
  console.log(`Missing Songs (${missingLocalSongNames.length}):`);
  console.log(missingLocalSongNames.join('\n'));
};

crosslistSongs();
