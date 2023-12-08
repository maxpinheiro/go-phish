const fs = require('fs');
const cheerio = require('cheerio');

enum ResponseStatus {
  Success = 200,
  UnknownError = 500,
  NotFound = 404,
  Unauthorized = 401,
  Conflict = 409,
}

type SongTag = 'number' | 'animal' | 'gamehendge';

interface Song {
  id: string;
  name: string;
  tags: string[];
  artist?: string;
}

interface PrismaSong {
  name: string;
  slug: string;
  averageGap: number;
  points: number;
  tags: string[];
}

type SongData = Omit<PrismaSong, 'id'>;

const scrapeSongFrequency = async (song: Song): Promise<number | ResponseStatus.NotFound> => {
  const res = await fetch(`https://phish.net/song/${song.id}`);
  if (res.ok || res.status === 200) {
    const body = await res.text();
    const $ = cheerio.load(body);
    const $text = $("p:contains('Since its debut')");
    const text = $text.text();
    const totalCountMatch = text.match(/It was played (?<count>\d+(,\d+)*) time\(s\) at the following show\(s\)/);
    const showsSinceDebutMatch = text.match(/There have been (?<count>\d+(,\d+)*) shows since the live debut/);

    if (totalCountMatch && showsSinceDebutMatch) {
      const totalCount = parseInt(totalCountMatch['groups']?.count?.toString().replace(/,/g, '') || '');
      const showsSinceDebut = parseInt(showsSinceDebutMatch['groups']?.count?.toString().replace(/,/g, '') || '');
      const frequency = totalCount / showsSinceDebut;
      let inverseFrequency = 1.0 / frequency;
      inverseFrequency = Math.floor(inverseFrequency * 1000) / 1000;
      return inverseFrequency;
    } else {
      console.log(`missing: ${song.name}`);
    }
    return -1;
    //return ResponseStatus.NotFound;
  } else {
    return ResponseStatus.NotFound;
  }
};

const songsWithTags: Record<string, SongTag[]> = {
  '2001': ['number'],
  '46 Days': ['number'],
  '555': ['number'],
  'A Song I Heard The Ocean Sing': [],
  'A Wave Of Hope': [],
  Alaska: [],
  'About to Run': [],
  'AC/DC Bag': [],
  'Access Me': [],
  'After Midnight': [],
  'All of These Dreams': [],
  'All Things Reconsidered': [],
  'Alumni Blues': [],
  'Amazing Grace': [], // ?,
  Anarchy: [],
  'And So To Bed': [], // ?
  'Anything but Me': [],
  'Army of One': [],
  'Ass Handed': [],
  'Auld Lang Syne': [],
  'Avenu Malkenu': [],
  Axilla: [],
  'Axilla (Part II)': [],
  'Back at the Chicken Shack': ['animal'],
  'Back on the Train': [],
  'Backwards Down the Number Line': [],
  'Bathtub Gin': [],
  'Beauty Of My Dreams': [],
  'Beneath a Sea of Stars (Part 1)': [],
  'Big Black Furry Creature From Mars': ['animal'],
  'Billy Breathes': [],
  'Birds Of A Feather': ['animal'],
  "Bitchin' Again": [],
  'Bittersweet Motel': [],
  'Blaze On': [],
  'Black-Eyed Katy': [],
  Bliss: [],
  'Bold As Love': [],
  'Bouncing Around The Room': [],
  'Breath and Burning': [],
  'Brian And Robert': [],
  Brother: [],
  'Buffalo Bill': ['animal'],
  Bug: ['animal'],
  'Buried Alive': [],
  'Camel Walk': ['animal'],
  Carini: [],
  'Cars Trucks Buses': [],
  Catapult: [],
  Cavern: [],
  'Chalk Dust Torture': [],
  'Character Zero': ['number'],
  Cities: [],
  'Clear Your Mind': [],
  "Colonel Forbin's Ascent": [],
  Contact: [],
  'Cool Amber and Mercury': [],
  Corinna: [],
  'Crimes of the Mind': [],
  Crossroads: [],
  'Crosseyed And Painless': [],
  'Crowd Control': [],
  Dahlia: [],
  "Dave's Energy Guide": [],
  'David Bowie': [],
  "Death Don't Hurt Very Long": [],
  Demand: [],
  'Destiny Unbound': [],
  'Dinner And A Movie': [],
  Dirt: [],
  'Divided Sky': [],
  'Dog Faced Boy': ['animal'],
  'Dog Gone Dog': ['animal'], // ?
  'Dog Log': ['animal'], // ?
  'Dogs Stole Things': ['animal'],
  "Don't Doubt Me": [],
  'Down With Disease': [],
  Driver: [],
  Drowned: [],
  'Egg In A Hole': [],
  Eliza: [],
  'Emotional Rescue': [],
  'End Of Session': [],
  Esther: [],
  'Evening Song': [],
  "Everything's Right": [],
  Evolve: [],
  Faht: [],
  'Family Picture': [],
  Farmhouse: [],
  'Fast Enough For You': [],
  Fee: [], // 'animal'?
  Fikus: [],
  Fire: [],
  'First Tube': [],
  'Flat Fee': [],
  Fluffhead: [],
  'Fly Famous Mockingbird': ['animal'],
  Foam: [],
  Frankenstein: [],
  'Frankie Says': [],
  Free: [],
  Friday: [],
  'Fuck Your Face': [],
  Fuego: [],
  'Funky Bitch': [],
  'Get More Down': [],
  Ghost: [],
  'Ginseng Sullivan': [],
  Glide: [],
  'Golden Age': [],
  'Golgi Apparatus': [],
  'Good Times Bad Times': [],
  'Gotta Jibboo': [],
  Grind: [],
  'Guelah Papyrus': [],
  Gumbo: [],
  Guyute: ['animal'],
  'Ha Ha Ha': [],
  'Halfway to the Moon': [],
  "Halley's Comet": [],
  Harpua: ['animal'],
  'Harry Hood': [],
  'Have Mercy': [],
  Heartbreaker: [],
  'Heavy Things': [],
  'Hello My Baby': [],
  'Hold Your Head Up': [],
  Horn: [],
  'I Always Wanted It This Way': [],
  'I Am Hydrogen': [],
  'I Am In Miami': [],
  'I Been Around': [],
  "I Didn't Know": [],
  'I Know A Little': [],
  'I Never Needed You Like This Before': [],
  "I Want To Be a Cowboy's Sweetheart": [],
  Icculus: [],
  'If I Could': [],
  "It's Ice": [],
  Izabella: [],
  Jessica: [],
  'Jesus Just Left Chicago': [],
  Joy: [],
  Julius: [],
  'Keyboard Army': [],
  'Kill Devil Falls': [],
  'Knuckle Bone Broth Avenue': [],
  Kung: [],
  'Lawn Boy': [],
  Leaves: [],
  Lengthwise: [],
  'Letter To Jimmy Page': [],
  Lifeboy: [],
  Light: [],
  'Limb By Limb': [],
  Llama: ['animal'],
  'Lonely Trip': [],
  'Loving Cup': [],
  Magilla: [],
  'Maiden Voyage': [],
  'Makisupa Policeman': [],
  Manteca: [],
  'Martian Monster': ['animal'],
  Maze: [],
  'McGrupp and the Watchful Hosemasters': ['animal'],
  Meat: [],
  Meatstick: [],
  'Mellow Mood': [],
  Mercury: [],
  'Mexican Cousin': [],
  "Mike's Song": [],
  'Mirror in the Bathroom': [],
  'Miss You': [],
  'Mock Song': [],
  More: [],
  "Most Events Aren't Planned": [],
  Mound: [],
  'Mountains In The Mist': [],
  Mull: [],
  'My Friend My Friend': [],
  "My Mind's Got A Mind Of Its Own": [],
  'My Soul': [],
  'My Sweet One': [],
  NICU: [],
  'Night Nurse': [],
  'No Dogs Allowed': ['animal'],
  "No Men In No Man's Land": [],
  'No Quarter': [],
  NO2: [],
  Nothing: [],
  Oblivion: [],
  Ocelot: ['animal'],
  "Olivia's Pool": [],
  'Party Time': [],
  'Paul and Silas': [],
  'Peaches En Regalia': [],
  'Pebbles and Marbles': [],
  'Pig In A Pen': [],
  Piper: [],
  Plasma: [],
  'Poor Heart': [],
  Possum: [],
  'Prince Caspian': [],
  'Punch You In The Eye': [],
  'Purple Rain': [],
  'Ramble On': [],
  Reba: [],
  "Revolution's Over": [],
  Rift: [],
  'Rock And Roll': [],
  'Rock And Roll All Nite': [],
  'Rocky Top': [],
  Roggae: [],
  'Roses Are Free': [],
  'Round Room': [],
  'Ruby Waves': [],
  'Run Like an Antelope': [],
  'Runaway Jim': [],
  'Sample In A Jar': [],
  Sand: [],
  Sanity: [],
  'Satin Doll': [],
  'Saw It Again': [],
  'Say It To Me SANTOS': [],
  'Scent Of A Mule': [],
  'Scents and Subtle Sounds': [],
  'Sea And Sand': [],
  'Secret Smile': [],
  Self: [],
  'Set Your Soul Free': [],
  'Seven Below': [],
  'Sexual Healing': [],
  Shade: [],
  Shafty: [],
  'Shaggy Dog': [],
  'Show Of Life': [],
  'Sigma Oasis': [],
  'Silent In The Morning': [],
  Simple: [],
  'Slave To The Traffic Light': [],
  Sleep: [],
  'Sleep Again': [],
  'Sleeping Monkey': [],
  "Sneakin' Sally Through The Alley": [],
  'Something Living Here': [],
  'Soul Planet': [],
  Sparkle: [],
  'Split Open And Melt': [],
  "Spock's Brain": [],
  'Stairway To Heaven': [],
  Stash: [],
  'Stealing Time from the Faulty Plan': [],
  Steam: [],
  Steep: [],
  'Strange Design': [],
  'Stray Dog': [],
  'Sugar Shack': [],
  'Suspicious Minds': [],
  'Suzy Greenberg': [],
  'Sweet Adeline': [],
  'Swept Away': [],
  Talk: [],
  Taste: [],
  Tela: [],
  'Thank You': [],
  Thanksgiving: [],
  'The 9th Cube': [],
  'The Connection': [],
  'The Curtain': [],
  'The Curtain With': [],
  'The Dogs': [],
  'The Final Hurrah': [],
  'The Horse': [],
  'The Howling': [],
  'The Inner Reaches of Outer': [],
  'The Landlady': [],
  'The Line': [],
  'The Lizards': [],
  'The Man Who Stepped Into Yesterday': [],
  'The Mango Song': [],
  'The Moma Dance': [],
  'The Oh Kee Pa Ceremony': [],
  'The Old Home Place': [],
  'The Sloth': [],
  'The Squirming Coil': [],
  'The Unwinding': [],
  'The Wedge': [],
  //'The Well': [],
  'Theme From The Bottom': [],
  Thread: [],
  'Timber (Jerry the Mule)': [],
  'Torn And Frayed': [],
  'Train Song': [],
  Tube: [],
  'Turtle In The Clouds': [],
  Tweezer: [],
  'Tweezer Reprise': [],
  'Twenty Years Later': [],
  Twist: [],
  'Two Versions of Me': [],
  'Uncle Pen': [],
  Undermind: [],
  Vultures: [],
  'Wading in the Velvet Sea': [],
  'Waiting All Night': [],
  'Walk Away': [],
  'Walls of the Cave': [],
  Waste: [],
  'Water In The Sky': [],
  Waves: [],
  'We Are Come to Outlive Our Brains': [],
  'Weekapaug Groove': [],
  Weigh: [],
  "What's The Use?": [],
  'When the Circus Comes': [],
  'Whole Lotta Love': [],
  'Wildwood Weed': [],
  Wilson: [],
  Wingsuit: [],
  "Wolfman's Brother": [],
  Wombat: [],
  'Ya Mar': [],
  'Yarmouth Road': [],
  'You Enjoy Myself': [],
  'Your Pet Cat': [],
};

const serializeSongName = (songName: string): string =>
  songName
    .toLowerCase()
    .replace(/[/'()]/g, '')
    .split(' ')
    .join('-');

const songList: Song[] = Object.entries(songsWithTags).map(([song, tags]) => ({
  id: serializeSongName(song),
  name: song,
  tags,
}));

const zip = <A, B>(a: A[], b: B[]): [A, B][] => a.map((k, i) => [k, b[i]]);

function roundHalf(num: number) {
  return Math.round(num * 2) / 2;
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z / 3));
}

const collectSongInfo = async () => {
  const songs = songList as Song[];
  let frequencies: number[] = [];
  const batchSize = 20;
  let min = 1000;
  for (let i = 0; i < songs.length && frequencies.length < songs.length; i += batchSize) {
    const songBatch = songs.slice(i, i + batchSize);
    const freqs = await Promise.all(songBatch.map((song) => scrapeSongFrequency(song)));
    const localMin = Math.min(...freqs.filter((f) => f > 0));
    min = Math.min(localMin, min);
    frequencies.push(...freqs);
  }
  console.dir(frequencies, { maxArrayLength: null });
  let songFreqs: { song: Song; frequency: number | 'not found'; points: number }[] = zip(songs, frequencies).map(
    ([s, f]) => ({
      song: s,
      frequency: f === ResponseStatus.NotFound ? 'not found' : f,
      points: f === ResponseStatus.NotFound ? -1 : roundHalf(sigmoid(f / min) * 14 - 7.25),
    })
  );

  songFreqs.sort((a, b) => a.song.name.localeCompare(b.song.name));

  const prismaSongs: SongData[] = songFreqs.map(({ song, frequency, points }) => ({
    name: song.name,
    slug: song.id,
    tags: song.tags,
    averageGap: frequency === 'not found' ? -1 : frequency,
    points: points,
  }));

  const rows = ['name', 'slug', 'averageGap', 'points', 'tags'].join(',');
  const dataRows = prismaSongs.map(({ name, slug, averageGap, points, tags }) =>
    [name, slug, averageGap, points, JSON.stringify(tags)].join(',')
  );
  const writeData = [rows, ...dataRows].join('\n');
  const writeFile = './data/songs.csv';
  fs.writeFile(writeFile, writeData, function (err: any) {
    if (err) {
      return console.log(err);
    }
    console.log(`Wrote to ${writeFile}`);
  });
};

collectSongInfo();

// const printDistribution = (songFreqs: { song: Song; frequency: number | 'not found'; points: number }[]): string => {
//   let pointFreqs: Record<number, number> = {};
//   songFreqs.forEach(({ song, frequency, points }) => {
//     if (!(points in pointFreqs)) {
//       pointFreqs[points] = 0;
//     }
//     pointFreqs[points] = pointFreqs[points] + 1;
//   });
//   return Object.entries(pointFreqs)
//     .sort(([pA, cA], [pB, cB]) => parseInt(pA) - parseInt(pB))
//     .map(([points, count]) => `${points} -> ${count}`)
//     .join(' | ');
// };
