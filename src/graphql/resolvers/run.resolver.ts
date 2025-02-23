import prisma from '@/services/db.service';
import { IResolvers } from '@graphql-tools/utils';
import { Guess, Run, Show, Venue } from '@prisma/client';
import { globalIdResolver, idResolver } from './node.resolvers';
import { Resolver } from './util.resolver';

/*
  type Query {
    runBySlug(slug: String!): Run
  }

  type Run implements Node {
    id: ID!
    runId: Int!
    name: String!
    dates: [Date!]!
    venueId: Int!
    venue: Venue!
    shows: [Show!]!
    slug: String!
    guesses(completed: Boolean): [Guess!]!
  }
*/

const runBySlugResolver: Resolver<any, { slug: string }, Run | null> = async (_, { slug }, _context) => {
  return await prisma.run.findUnique({ where: { slug } });
};

const venueForRunResolver: Resolver<Run, any, Venue> = async (run, _, { loaders }) => {
  return loaders.venueLoader.load(run.venueId);
};

const showsForRunResolver: Resolver<Run, any, Show[]> = async (run, _, { loaders }) => {
  return loaders.showsForRunLoader.load(run.id);
};

const guessesForRunResolver: Resolver<Run, { completed?: boolean }, Guess[]> = async (
  run,
  { completed },
  { loaders }
) => {
  return (await loaders.guessesForRunLoader.load(run.id)).filter(
    (guess) => completed === undefined || guess.completed === completed
  );
};

const gidResolver: Resolver<Run, any, String> = globalIdResolver('Run');

export const runResolvers: IResolvers = {
  Query: {
    runBySlug: runBySlugResolver,
  },
  Run: {
    id: gidResolver,
    runId: idResolver,
    venue: venueForRunResolver,
    shows: showsForRunResolver,
    guesses: guessesForRunResolver,
  },
};
