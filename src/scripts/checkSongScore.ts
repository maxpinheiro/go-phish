import { scrapeSongFrequency } from '@/services/phishnet.service';
import { songPointsByFrequency } from '@/utils/score.util';

const collectScore = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Missing song id.');
    return;
  }

  const songId = args[0];
  console.log(`Fetching score for ${songId}...`);
  const frequency = await scrapeSongFrequency(songId);
  if (frequency <= 0) {
    return;
  }
  console.log(`Frequency: ${frequency}`);

  const score = songPointsByFrequency(frequency);
  console.log(`Score: ${score}`);
};

collectScore();
