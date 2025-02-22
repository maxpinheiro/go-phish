import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';
import { User } from '@prisma/client';
import { guessResolvers, guessTypeDefs } from './resolvers/guess.resolver';
import { runResolvers, runTypeDefs } from './resolvers/run.resolver';
import { showResolvers, showTypeDefs } from './resolvers/show.resolver';
import { songResolvers, songTypeDefs } from './resolvers/song.resolver';
import { userResolvers, userTypeDefs } from './resolvers/user.resolver';
import { Resolver, utilTypeDefs } from './resolvers/util.resolver';
import { venueResolvers, venueTypeDefs } from './resolvers/venue.resolver';

const queryTypeDefs = /* GraphQL */ `
  type Query {
    me: User
  }
`;

const meResolver: Resolver<any, any, User | null> = async (_, _args, { userId, loaders }) => {
  if (!userId) return null;
  return loaders.userLoader.load(userId);
};

const queryResolvers: IResolvers = {
  Query: {
    me: meResolver,
  },
};

const typeDefs = [
  utilTypeDefs,
  queryTypeDefs,
  songTypeDefs,
  userTypeDefs,
  venueTypeDefs,
  runTypeDefs,
  showTypeDefs,
  guessTypeDefs,
];

const resolvers = [
  queryResolvers,
  songResolvers,
  userResolvers,
  venueResolvers,
  runResolvers,
  showResolvers,
  guessResolvers,
];

export const schema = makeExecutableSchema({ typeDefs, resolvers });
