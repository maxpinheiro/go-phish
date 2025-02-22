import { createLoaders } from '@/services/graphql/dataloader';
import { schema } from '@/services/graphql/schema';
import { graphqlHTTP } from 'express-graphql';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  return graphqlHTTP({
    schema: schema,
    context: {
      loaders: createLoaders(),
      userId,
    },
    graphiql: process.env.NODE_ENV === 'development',
    // @ts-ignore
  })(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
