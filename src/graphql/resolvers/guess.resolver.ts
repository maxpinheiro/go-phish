import { IResolvers } from '@graphql-tools/utils';
import { Guess, Run, Show, User } from '@prisma/client';
import { globalIdResolver, idResolver } from './node.resolvers';
import { Resolver } from './util.resolver';

/*
  type Guess implements Node {
    id: ID!
    guessId: Int!
    userId: Int!
    user: User!
    songId: String!
    songName: String!
    showId: Int!
    show: Show!
    runId: Int!
    run: Run!
    encore: Boolean!
    completed: Boolean!
    points: Float!
  }
*/

const userForGuessResolver: Resolver<Guess, any, User> = async (guess, _, { loaders }) => {
  return loaders.userLoader.load(guess.userId);
};

const runForGuessResolver: Resolver<Guess, any, Run> = async (guess, _, { loaders }) => {
  return loaders.runLoader.load(guess.runId);
};

const showForGuessResolver: Resolver<Guess, any, Show> = async (guess, _, { loaders }) => {
  return loaders.showLoader.load(guess.showId);
};

const gidResolver: Resolver<Guess, any, String> = globalIdResolver('Guess');

export const guessResolvers: IResolvers = {
  Guess: {
    id: gidResolver,
    guessId: idResolver,
    user: userForGuessResolver,
    run: runForGuessResolver,
    show: showForGuessResolver,
  },
};
