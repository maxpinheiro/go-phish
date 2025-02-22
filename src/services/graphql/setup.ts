import { makeExecutableSchema } from "@graphql-tools/schema";
import { modelTypeDefs } from "./schema";
import { GraphQLParseOptions, IResolvers, IResolverValidationOptions, SchemaExtensions, TypeSource } from '@graphql-tools/utils';

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

type ResolverContext = {};
type Resolver<Source, Args, Output> = (obj: Source, args: Args, context: ResolverContext, info: any) => null | undefined | Output[] | Output | Promise<Output[]> | Promise<Output>[];

const queryResolvers: IResolvers = {
  Query: {
    me(_, _args, _context, _info) {

    },
    userByName(_, args, _context, _info) {

    },
    allShows(_, _, _context, _) {

    },
  },
};

const userResolvers = {
  User: {

  }
};

const resolvers = [queryResolvers, userResolvers];

export const schema = makeExecutableSchema({ typeDefs, resolvers });
