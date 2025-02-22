import { Guess, User } from "@prisma/client";
import { Resolver } from "../setup";
import { IResolvers } from "@graphql-tools/utils";

/*
  type Query {
    userByName(username: String!): User
  }

  type Avatar {
    head: String!
    torso: String!
    background: String!
    type: String
  }

  type User {
    id: Int!
    username: String!
    name: String
    bio: String
    homemtown: String
    email: String
    image: String
    admin: Boolean!
    avatar: Avatar
    avatarType: String
    friend_ids: [Int!]!
    guesses: [Guess!]!
  }
*/

const userByNameResolver: Resolver<any, {username: string}, User | null> = async (_, {username}, _context) => {
  return await prisma.user.findUnique({ where: { username }});
};

const guessesForUserResolver: Resolver<User, any, Guess[]> = async (user, _, { loaders }) => {
  return loaders.guessesForUserLoader.load(user.id);
};

export const userResolvers: IResolvers = {
  Query: {
    userByName: userByNameResolver,
  },
  User: {
    guesses: guessesForUserResolver,
  }
};
