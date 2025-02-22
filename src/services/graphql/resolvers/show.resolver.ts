import { IResolvers } from '@graphql-tools/utils';
import { Run, Show, Venue } from '@prisma/client';
import { Resolver } from './util.resolver';

export const showTypeDefs = /* GraphQL */ `
  type Query {
    allShows: [Show!]!
    showBySlug(slug: String!): Show
    showForDate(dateStr: String): Show
  }

  type Show {
    id: Int!
    runId: Int!
    run: Run!
    runNight: Int!
    date: Date!
    timestamp: Date!
    venueId: Int!
    venue: Venue!
    slug: String!
  }
`;

const allShowsResolver: Resolver<any, { slug: string }, Show[]> = async (_, _args, _context) => {
  return await prisma.show.findMany();
};

const showBySlugResolver: Resolver<any, { slug: string }, Show | null> = async (_, { slug }, _context) => {
  return await prisma.show.findUnique({ where: { slug } });
};

const showForDateResolver: Resolver<any, { dateStr: string }, Show | null> = async (_, { dateStr }, _context) => {
  return await prisma.show.findFirst({ where: { date: new Date(dateStr) } });
};

const runForShowResolver: Resolver<Show, any, Run> = async (show, _, { loaders }) => {
  return loaders.runLoader.load(show.runId);
};

const venueForShowResolver: Resolver<Show, any, Venue> = async (show, _, { loaders }) => {
  return loaders.venueLoader.load(show.venueId);
};

export const showResolvers: IResolvers = {
  Query: {
    allShows: allShowsResolver,
    showBySlug: showBySlugResolver,
    showForDate: showForDateResolver,
  },
  Show: {
    run: runForShowResolver,
    venue: venueForShowResolver,
  },
};
