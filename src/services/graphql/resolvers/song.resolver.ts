import prisma from '@/services/db.service';
import { IResolvers } from '@graphql-tools/utils';
import { Song } from '@prisma/client';
import { Resolver } from './util.resolver';

export const songTypeDefs = /* GraphQL */ `
  type Query {
    allSongs: [Song!]!
  }

  type Song {
    id: String!
    name: String!
    averageGap: Float!
    points: Float!
    tags: [String!]
  }
`;

const allSongsResolver: Resolver<any, any, Song[]> = async (_, _args, _context) => {
  return await prisma.song.findMany();
};

export const songResolvers: IResolvers = {
  Query: {
    allSongs: allSongsResolver,
  },
};
