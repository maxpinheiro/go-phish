import { getAllSongs as getAllPhishNetSongs } from '@/services/phishnet.service';
import { getAllSongs } from '@/services/song.service';
import { ResponseStatus } from '@/types/main';

const crosslistSongs = async () => {
  const localSongs = await getAllSongs();
  const apiSongs = await getAllPhishNetSongs();
  if (apiSongs === ResponseStatus.UnknownError) {
    return;
  }
  apiSongs.sort((a, b) => a.name.localeCompare(b.name));
  localSongs.sort((a, b) => a.name.localeCompare(b.name));
  console.log(apiSongs.map((s) => s.name).join('\n'));
};

crosslistSongs();
