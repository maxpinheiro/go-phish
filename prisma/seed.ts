import { PrismaClient, Run, Show, Song, User, Venue } from '@prisma/client';

const prisma = new PrismaClient();

async function createUsers() {
  const max = await prisma.user.upsert({
    where: { username: 'puffhead' },
    update: {},
    create: {
      username: 'puffhead',
      password: 'password1',
      name: 'Max',
      bio: 'this is a bio',
      hometown: 'philly',
      email: 'max@gmail.com',
      avatar: {
        head: '#FF0000',
        torso: '#00FF00',
        background: '#0000FF',
      },
    },
  });
  const scott = await prisma.user.upsert({
    where: { username: 'SubtlePhan' },
    update: {},
    create: {
      username: 'SubtlePhan',
      password: 'password2',
      name: 'Scott',
      bio: '',
      email: 'scott@gmail.com',
      avatar: {
        head: '#FF0000',
        torso: '#00FF00',
        background: '#0000FF',
      },
    },
  });

  return [max, scott];
}

async function createSongs() {
  const song2001 = await prisma.song.upsert({
    where: { id: 'also-sprach-zarathustra' },
    update: {},
    create: {
      id: 'also-sprach-zarathustra',
      name: '2001',
      averageGap: 4.684,
      points: 1.5,
    },
  });
  const goldenAge = await prisma.song.upsert({
    where: { id: 'golden-age' },
    update: {},
    create: {
      id: 'golden-age',
      name: 'Golden Age',
      averageGap: 7.294,
      points: 2.5,
    },
  });
  const llama = await prisma.song.upsert({
    where: { id: 'llama' },
    update: {},
    create: {
      id: 'llama',
      name: 'Llama',
      averageGap: 4.953,
      points: 1.5,
    },
  });
  const reba = await prisma.song.upsert({
    where: { id: 'reba' },
    update: {},
    create: {
      id: 'reba',
      name: 'Reba',
      averageGap: 4.283,
      points: 1.5,
    },
  });
  const tweezer = await prisma.song.upsert({
    where: { id: 'tweezer' },
    update: {},
    create: {
      id: 'tweezer',
      name: 'Tweezer',
      averageGap: 2,
      points: 1,
    },
  });
  return [song2001, goldenAge, llama, reba, tweezer];
}

async function createVenues() {
  const msg = await prisma.venue.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Madison Square Garden',
      tz_id: 'America/New_York',
      tz_name: 'EST',
      name_abbr: 'MSG',
      city: 'New York',
      state: 'New York',
      country: 'USA',
    },
  });
  const moonPalace = await prisma.venue.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Moon Palace',
      tz_id: 'America/Cancul',
      tz_name: 'EST',
      city: 'Cancun, Quintana Roo',
      country: 'Mexico',
    },
  });

  return [msg, moonPalace];
}

async function createRuns(venues: Venue[]) {
  const [msg, moonPalace] = venues;

  const nye24 = await prisma.run.upsert({
    where: { slug: 'new-years-run-24' },
    update: {},
    create: {
      slug: 'new-years-run-24',
      name: "New Year's Run '24",
      dates: [new Date('2024-12-28'), new Date('2024-12-29'), new Date('2024-12-30'), new Date('2024-12-31')],
      venueId: msg.id,
    },
  });
  const mexico25 = await prisma.run.upsert({
    where: { slug: 'riviera-maya-25' },
    update: {},
    create: {
      slug: 'riviera-maya-25',
      name: "Riviera Maya '25",
      dates: [new Date('2025-01-29'), new Date('2025-01-30'), new Date('2025-01-31'), new Date('2025-02-01')],
      venueId: moonPalace.id,
    },
  });

  return [nye24, mexico25];
}

async function createShows(runs: Run[]) {
  const [nye24, mexico25] = runs;

  const nye24n1 = await prisma.show.upsert({
    where: { slug: 'new-years-run-24-n1' },
    update: {},
    create: {
      slug: 'new-years-run-24-n1',
      runId: nye24.id,
      runNight: 1,
      date: new Date('2024-12-28'),
      timestamp: new Date('2024-12-28T00:00:00Z'),
      venueId: nye24.venueId,
    },
  });
  const nye24n2 = await prisma.show.upsert({
    where: { slug: 'new-years-run-24-n2' },
    update: {},
    create: {
      slug: 'new-years-run-24-n2',
      runId: nye24.id,
      runNight: 2,
      date: new Date('2024-12-29'),
      timestamp: new Date('2024-12-29T00:00:00Z'),
      venueId: nye24.venueId,
    },
  });
  const nye24n3 = await prisma.show.upsert({
    where: { slug: 'new-years-run-24-n3' },
    update: {},
    create: {
      slug: 'new-years-run-24-n3',
      runId: nye24.id,
      runNight: 3,
      date: new Date('2024-12-30'),
      timestamp: new Date('2024-12-30T00:00:00Z'),
      venueId: nye24.venueId,
    },
  });
  const nye24n4 = await prisma.show.upsert({
    where: { slug: 'new-years-run-24-n4' },
    update: {},
    create: {
      slug: 'new-years-run-24-n4',
      runId: nye24.id,
      runNight: 4,
      date: new Date('2024-12-31'),
      timestamp: new Date('2024-12-31T00:00:00Z'),
      venueId: nye24.venueId,
    },
  });
  const mexico25n1 = await prisma.show.upsert({
    where: { slug: 'riviera-maya-25-n1' },
    update: {},
    create: {
      slug: 'riviera-maya-25-n1',
      runId: mexico25.id,
      runNight: 1,
      date: new Date('2025-01-29'),
      timestamp: new Date('2025-01-29T00:00:00Z'),
      venueId: mexico25.venueId,
    },
  });
  const mexico25n2 = await prisma.show.upsert({
    where: { slug: 'riviera-maya-25-n2' },
    update: {},
    create: {
      slug: 'riviera-maya-25-n2',
      runId: mexico25.id,
      runNight: 2,
      date: new Date('2025-01-30'),
      timestamp: new Date('2025-01-30T00:00:00Z'),
      venueId: mexico25.venueId,
    },
  });
  const mexico25n3 = await prisma.show.upsert({
    where: { slug: 'riviera-maya-25-n3' },
    update: {},
    create: {
      slug: 'riviera-maya-25-n3',
      runId: mexico25.id,
      runNight: 3,
      date: new Date('2025-01-31'),
      timestamp: new Date('2025-01-31T00:00:00Z'),
      venueId: mexico25.venueId,
    },
  });
  const mexico25n4 = await prisma.show.upsert({
    where: { slug: 'riviera-maya-25-n4' },
    update: {},
    create: {
      slug: 'riviera-maya-25-n4',
      runId: mexico25.id,
      runNight: 4,
      date: new Date('2025-02-01'),
      timestamp: new Date('2025-02-01T00:00:00Z'),
      venueId: mexico25.venueId,
    },
  });

  return [nye24n1, nye24n2, nye24n3, nye24n4, mexico25n1, mexico25n2, mexico25n3, mexico25n4];
}

async function createGuesses(users: User[], shows: Show[], songs: Song[]) {
  const [max, scott] = users;
  const [nye24n1, nye24n2, nye24n3, nye24n4, mexico25n1, mexico25n2, mexico25n3, mexico25n4] = shows;
  const [song2001, goldenAge, llama, reba, tweezer] = songs;

  const guesses: [User, Show, Song, boolean, boolean][] = [
    [max, nye24n1, song2001, false, false],
    [max, nye24n2, goldenAge, false, false],
    [max, nye24n3, goldenAge, false, true],
    [max, nye24n4, llama, false, false],
    [scott, nye24n1, goldenAge, false, false],
    [scott, nye24n2, reba, true, true],
    [max, mexico25n1, reba, false, true],
    [max, mexico25n2, song2001, false, false],
    [max, mexico25n3, tweezer, true, true],
    [scott, mexico25n2, reba, false, false],
    [scott, mexico25n3, tweezer, false, true],
    [scott, mexico25n4, llama, false, true],
  ];
  await Promise.all(
    guesses.map(([user, show, song, encore, completed], idx) =>
      prisma.guess.upsert({
        where: { id: idx + 1 },
        update: {},
        create: {
          id: idx + 1,
          userId: user.id,
          showId: show.id,
          runId: show.runId,
          songId: song.id,
          songName: song.name,
          encore,
          completed,
          points: completed ? song.points + (encore ? 3 : 0) : 0,
        },
      })
    )
  );
}

async function main() {
  const users = await createUsers();
  const songs = await createSongs();
  const venues = await createVenues();
  const runs = await createRuns(venues);
  const shows = await createShows(runs);
  await createGuesses(users, shows, songs);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
