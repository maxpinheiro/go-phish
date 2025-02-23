import { IResolvers } from '@graphql-tools/utils';
import { Run, Show, Venue } from '@prisma/client';
import { globalIdResolver, idResolver } from './node.resolvers';
import { Resolver } from './util.resolver';

/*
  type Venue implements Node {
    venueId: Int!
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

const gidResolver: Resolver<Venue, any, String> = globalIdResolver('Venue');

export const venueResolvers: IResolvers = {
  Venue: {
    id: gidResolver,
    venueId: idResolver,
    runs: runsForVenueResolver,
    shows: showsForVenueResolver,
  },
};
