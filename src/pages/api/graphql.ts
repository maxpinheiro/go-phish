import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlHTTP } from "express-graphql";
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
// import { schema } from '@/services/graphql/setup';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createLoaders } from '@/services/graphql/dataloader';

const typeDefs = `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello!",
  },
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  const session = await getServerSession(req);
  const userId = session?.user?.id;
  return graphqlHTTP({
    schema: schema,
    context: {
      loaders: createLoaders(),
      userId
    },
    graphiql: process.env.NODE_ENV === 'development'
  })(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
