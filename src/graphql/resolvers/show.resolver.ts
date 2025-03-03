import { guessEditForbiddenReason } from '@/utils/guess.util';
import { IResolvers } from '@graphql-tools/utils';
import { Guess, Run, Show, Venue } from '@prisma/client';
import { globalIdResolver, idResolver } from './node.resolvers';
import { Resolver } from './util.resolver';

/*
  type Query {
    allShows: [Show!]!
    showBySlug(slug: String!): Show
    showForDate(dateStr: String): Show
  }

  type Show implements Node {
    id: ID!
    showId: Int!
    runId: Int!
    run: Run!
    runNight: Int!
    date: Date!
    timestamp: Date!
    venueId: Int!
    venue: Venue!
    slug: String!
    guesses(completed: Boolean): [Guess!]
    myGuesses(completed: Boolean): [Guess!]
    "whether the current user is allowed to edit guesses for this show"
    guessEditForbiddenReason: String
  }
*/

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

const guessesForShowResolver: Resolver<Show, { completed?: boolean }, Guess[]> = async (
  show,
  { completed },
  { loaders }
) => {
  return (await loaders.guessesForShowLoader.load(show.id)).filter(
    (guess) => completed === undefined || guess.completed === completed
  );
};

const myGuessesForShowResolver: Resolver<Show, { completed?: boolean }, Guess[] | null> = async (
  show,
  { completed },
  { userId, loaders }
) => {
  if (!userId) return null;
  return (await loaders.guessesForShowLoader.load(show.id)).filter(
    (guess) => guess.userId === userId && (completed === undefined || guess.completed === completed)
  );
};

const guessEditForbiddenReasonResolver: Resolver<Show, any, String | null> = async (show, _, { userId, loaders }) => {
  if (!userId) return 'You must be signed in to edit guesses.';
  const user = await loaders.userLoader.load(userId);
  const venue = await loaders.venueLoader.load(show.venueId);
  return guessEditForbiddenReason(user, { ...show, venue });
};

const gidResolver: Resolver<Show, any, String> = globalIdResolver('Show');

export const showResolvers: IResolvers = {
  Query: {
    allShows: allShowsResolver,
    showBySlug: showBySlugResolver,
    showForDate: showForDateResolver,
  },
  Show: {
    id: gidResolver,
    showId: idResolver,
    run: runForShowResolver,
    venue: venueForShowResolver,
    guesses: guessesForShowResolver,
    myGuesses: myGuessesForShowResolver,
    guessEditForbiddenReason: guessEditForbiddenReasonResolver,
  },
};
