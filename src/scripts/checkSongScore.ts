import cheerio from 'cheerio';

function roundHalf(num: number) {
  return Math.round(num * 2) / 2;
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z / 3));
}

const collectSongFrequency = async (songId: string) => {
  const res = await fetch(`https://phish.net/song/${songId}`);
  if (res.ok || res.status === 200) {
    const body = await res.text();
    const $ = cheerio.load(body);
    const $text = $("p:contains('Since its debut')");
    const text = $text.text();
    // named groups supported if upgrade to es2018
    const totalCountMatch = text.match(/It was played (\d+(,\d+)*) time\(s\) at the following show\(s\)/);
    const showsSinceDebutMatch = text.match(/There have been (\d+(,\d+)*) shows since the live debut/);
    // const totalCountMatch = text.match(/It was played (?<count>\d+(,\d+)*) time\(s\) at the following show\(s\)/);
    // const showsSinceDebutMatch = text.match(/There have been (?<count>\d+(,\d+)*) shows since the live debut/);

    if (totalCountMatch && showsSinceDebutMatch) {
      const totalCount = parseInt(totalCountMatch[1]?.toString().replace(/,/g, '') || '');
      const showsSinceDebut = parseInt(showsSinceDebutMatch[1]?.toString().replace(/,/g, '') || '');
      // const totalCount = parseInt(totalCountMatch['groups']?.count?.toString().replace(/,/g, '') || '');
      // const showsSinceDebut = parseInt(showsSinceDebutMatch['groups']?.count?.toString().replace(/,/g, '') || '');
      const frequency = totalCount / showsSinceDebut;
      let inverseFrequency = 1.0 / frequency;
      inverseFrequency = Math.floor(inverseFrequency * 1000) / 1000;
      return inverseFrequency;
    } else {
      console.log(`Could not find info on page ${songId}`);
      return -1;
    }
  } else {
    console.log(`Could not find page ${songId}`);
    return -1;
  }
};

const collectScore = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Missing song id.');
    return;
  }

  const songId = args[0];
  console.log(`Fetching score for ${songId}...`);
  const frequency = await collectSongFrequency(songId);
  if (frequency <= 0) {
    return;
  }
  console.log(`Frequency: ${frequency}`);

  const min = 3.009;
  const score = roundHalf(sigmoid(frequency / min) * 14 - 7.25);
  console.log(`Score: ${score}`);
};

collectScore();
