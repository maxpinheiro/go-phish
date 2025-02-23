import { IResolvers } from '@graphql-tools/utils';
import { Run, Show, Venue } from '@prisma/client';
import { Resolver } from './util.resolver';

/*
  type Venue {
    id: Int!
    name: String!
    name_abbr: String
    city: String
    state: String
    country: String
    tz_id: String!
    tz_name: String
    runs: [Run!]!
    shows: [Show!]!
  }
*/

const runsForVenueResolver: Resolver<Venue, any, Run[]> = async (venue, _, { loaders }) => {
  return loaders.runsForVenueLoader.load(venue.id);
};

const showsForVenueResolver: Resolver<Venue, any, Show[]> = async (venue, _, { loaders }) => {
  return loaders.showsForVenueLoader.load(venue.id);
};

export const venueResolvers: IResolvers = {
  Venue: {
    runs: runsForVenueResolver,
    shows: showsForVenueResolver,
  },
};
