import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';
import { User } from '@prisma/client';
import { readFileSync } from 'fs';
import { guessResolvers } from './resolvers/guess.resolver';
import { runResolvers } from './resolvers/run.resolver';
import { showResolvers } from './resolvers/show.resolver';
import { songResolvers } from './resolvers/song.resolver';
import { userResolvers } from './resolvers/user.resolver';
import { Resolver } from './resolvers/util.resolver';
import { venueResolvers } from './resolvers/venue.resolver';

/*
  type Query {
    me: User
  }
*/

const meResolver: Resolver<any, any, User | null> = async (_, _args, { userId, loaders }) => {
  if (!userId) return null;
  return loaders.userLoader.load(userId);
};

const queryResolvers: IResolvers = {
  Query: {
    me: meResolver,
  },
};

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

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
