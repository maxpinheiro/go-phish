import { CreateRunData } from '@/models/run.model';
import { CreateShowData } from '@/models/show.model';
import { CreateVenueData } from '@/models/venue.model';
import { getUpcomingShows } from '@/services/phishnet.service';
import { createRun } from '@/services/run.service';
import { createShow, getAllShowsWithVenues } from '@/services/show.service';
import { getAllVenues } from '@/services/venue.service';
import { PhishNetShow, ResponseStatus } from '@/types/main';
import { dateToDateString } from '@/utils/date.util';
import { askQuestion } from '@/utils/io.util';
import { Run, Show, Venue } from '@prisma/client';
import { find } from 'geo-tz';
import moment from 'moment-timezone';

const fetchUpcomingShows = async () => {
  const now = new Date();
  let localShows = await getAllShowsWithVenues();
  localShows = localShows.filter((show) => show.date > now);
  let apiShows = await getUpcomingShows();
  if (apiShows === ResponseStatus.UnknownError || apiShows == ResponseStatus.NotFound) {
    return;
  }
  // use showdate as identifier
  const showsByDates = new Map(localShows.map((show) => [dateToDateString(show.date), show.id]));
  const newShows = apiShows; //.filter((show) => !(show.showdate in showsByDates));
  console.log(`New shows (${newShows.length})`);
  // finding lat/lon for venue:
  // https://www.google.com/maps/search/Climate+Pledge+Arena+Seattle+WA+USA
  // https://www.google.com/maps/search/[venue, city, state, country].join('+')
  newShows.forEach((show) => {
    // console.log(show);
  });

  await addNewShows(newShows);
};

const addNewShows = async (newShows: PhishNetShow[]) => {
  const allVenues = await getAllVenues();

  const venueLookup = new Map(allVenues.map((v) => [formatVenueIdentifier(v), true]));

  const showGroups = groupShows(newShows);

  // for each show, we need a run and venue, and each run needs a venue; so,
  // first create any necessary venues, then create runs, then create shows
  // build new venues
  let showsWithoutVenues: PhishNetShow[] = [];
  showGroups.forEach((shows) => {
    let show = shows[0];
    if (!(formatVenueIdentifier(show) in venueLookup)) {
      showsWithoutVenues.push(show);
    }
  });
  const newVenueLookup: Record<string, CreateVenueData> = await buildNewVenues(showsWithoutVenues);
  // let newVenues: CreateVenueData[] = [];
  console.log(newVenueLookup);
  // for each group of shows, create run then create each show
  for (const shows of showGroups) {
  }
  // console.log(showGroups);
};

const buildNewVenues = async (shows: PhishNetShow[]): Promise<Record<string, CreateVenueData>> => {
  let venueLookup: Record<string, CreateVenueData> = {};
  for (const show of shows) {
    const identifier = formatVenueIdentifier(show);
    if (!(identifier in venueLookup)) {
      const newVenue = await buildVenueFromPhishNetShow(show);
      venueLookup[identifier] = newVenue;
    }
  }
  return venueLookup;
};

const createRunsAndShows = async (
  showGroups: PhishNetShow[][],
  venueLookup: Record<string, Venue>
): Promise<Show[]> => {
  let createdShows: Show[] = [];
  for (const shows of showGroups) {
    const identifier = formatVenueIdentifier(shows[0]);
    const venue = venueLookup[identifier];
    if (!venue) {
      console.log(`Could not find venue: ${identifier}`);
      continue;
    }
    const runData = await buildRunFromPhishNetShows(shows, venue);
    const run = await createRun(runData);
    console.log(`Successfully created run ${run.id}`);
    const newShows = await createShows(shows, run, venue);
    console.log(`Successfully created ${newShows.length} shows: [${newShows.map((s) => s.id).join(', ')}]`);
  }
  return createdShows;
};

const createShows = async (shows: PhishNetShow[], run: Run, venue: Venue): Promise<Show[]> => {
  const showData: CreateShowData[] = shows.map((show, idx) => {
    return {
      runId: run.id,
      runNight: idx + 1,
      date: new Date(show.showdate),
      timestamp: new Date(show.showdate),
      venueId: venue.id,
    };
  });
  const newShows = await Promise.all(showData.map((data) => createShow(data)));
  return newShows;
};

const buildRunFromPhishNetShows = async (shows: PhishNetShow[], venue: Venue): Promise<CreateRunData> => {
  const dates = shows.map((s) => new Date(s.showdate));
  console.log(`\n\nTour Name: ${shows[0].venue}`);
  const name = await askQuestion('Run name: ');
  return {
    name,
    dates,
    venueId: venue.id,
  };
};

// unique identifier used to match phishnetshows with venues
const formatVenueIdentifier = (item: PhishNetShow | Venue): string => {
  return `${item.city}-${item.state}-${item.country}`;
};

const groupShows = (shows: PhishNetShow[]): PhishNetShow[][] => {
  let groups: PhishNetShow[][] = [];
  let currGroup: PhishNetShow[] = [];
  let prevShow: PhishNetShow | null = null;
  shows.forEach((currShow) => {
    if (!prevShow || samePhishNetRun(prevShow, currShow)) {
      currGroup.push(currShow);
    } else {
      groups.push([...currGroup]);
      currGroup = [currShow];
    }
    prevShow = currShow;
  });
  return groups;
};

const samePhishNetRun = (show1: PhishNetShow, show2: PhishNetShow): boolean =>
  show1.city == show2.city &&
  show1.state == show2.state &&
  show1.country == show2.country &&
  show1.tour_name == show2.tour_name;

const buildVenueFromPhishNetShow = async (show: PhishNetShow): Promise<CreateVenueData> => {
  console.log(
    `\n\nVenue Data:\n  Venue: ${show.venue}\n  City: ${show.city}\n  State: ${show.state}\n  Country: ${show.country}\n  Tour: ${show.tour_name}`
  );
  const name = await askQuestion('Venue name: ');
  let abbr = await askQuestion('Name abbreviation (optional): ');
  const name_abbr = abbr ? abbr : null;
  console.log(`To identify lat/lon, try: ${latLonSearch(show)}`);
  const latlon = await askQuestion('Lat, Lon: ');
  const [lat, lon] = latlon.split(',').map((x) => parseFloat(x));
  const [tz_id, tz_name] = await getTimezone(lat, lon);
  // const tz_id = await askQuestion('Timezone ID (eg America/New_Work): ');
  // const tz_name = await askQuestion('Timezone name (eg EST): ');
  return {
    name,
    name_abbr,
    city: show.city,
    state: show.state,
    country: show.country,
    tz_id,
    tz_name,
  };
};

const latLonSearch = (show: PhishNetShow): string => {
  const venue = show.venue.split(' ').join('+');
  const city = show.city.split(' ').join('+');
  return `https://www.google.com/maps/search/${[venue, city, show.state, show.country].join('+')}`;
};

const getTimezone = async (lat: number, lon: number): Promise<[string, string]> => {
  let names = find(lat, lon);
  let name: string;
  if (names.length == 1) {
    name = names[0];
  } else {
    console.log(`Options: \n${names.map((name, idx) => `  (${idx}) ${name}`).join('\n')}`);
    const idx = await askQuestion('Option idx: ');
    name = names[parseInt(idx)];
  }
  const nameAbbr = moment().tz(name).zoneAbbr();
  console.log(`Name abbr: ${nameAbbr}`);
  return [name, nameAbbr];
};
// const showfromPhishNet = (fromShow: PhishNetShow): CreateShowData => {
//   let show: CreateShowData = {
//     runId: 0,
//     runNight: 0,
//     date: undefined,
//     timestamp: undefined,
//     venueId: 0,
//   };
//   return show;
// };

fetchUpcomingShows();
