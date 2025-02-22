import { makeExecutableSchema } from "@graphql-tools/schema";
import { modelTypeDefs } from "./schema";
import { IResolvers } from '@graphql-tools/utils';
import { DataLoaders } from "./dataloader";
import { User } from "@prisma/client";
import { userResolvers } from "./resolvers/user.resolver";

const queryTypeDefs = `
  type Query {
    me: User

    userByName(username: String!): User

    allShows: [Show!]!
    showBySlug(slug: String!): Show
    showForDate(dateStr: DateString): Show

    runBySlug(slug: String!): Run
  }
`;

const typeDefs = [modelTypeDefs, queryTypeDefs];

type Context = {
  userId?: number;
  loaders: DataLoaders;
};

export type Resolver<Source, Args, Output> = (root: Source, args: Args, context: Context, info: any) => null | undefined | Output[] | Output | Promise<Output> | Promise<Output[]> | Promise<Output>[];

const meResolver: Resolver<any, any, User | null> = async (_, _args, { userId, loaders }) => {
  if (!userId) return null;
  return loaders.userLoader.load(userId);
};

const queryResolvers: IResolvers = {
  Query: {
    me: meResolver,
  },
};

const resolvers = [queryResolvers, userResolvers];

export const schema = makeExecutableSchema({ typeDefs, resolvers });
