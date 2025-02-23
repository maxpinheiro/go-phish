import prisma from '@/services/db.service';
import { IResolvers } from '@graphql-tools/utils';
import { Song } from '@prisma/client';
import { Resolver } from './util.resolver';

/*
  type Query {
    allSongs: [Song!]!
  }

  type Song implements Node {
    id: ID!
    songId: String!
    name: String!
    averageGap: Float!
    points: Float!
    tags: [String!]
  }
*/

const allSongsResolver: Resolver<any, any, Song[]> = async (_, _args, _context) => {
  return await prisma.song.findMany();
};

const songIdResolver: Resolver<Song, any, string> = async ({ id }, _, __) => id;

export const songResolvers: IResolvers = {
  Query: {
    allSongs: allSongsResolver,
  },
  Song: {
    songId: songIdResolver,
  },
};
