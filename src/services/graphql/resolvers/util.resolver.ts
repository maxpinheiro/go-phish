import { DataLoaders } from '../dataloader';

type Context = {
  userId?: number;
  loaders: DataLoaders;
};

export type Resolver<Source, Args, Output> = (
  root: Source,
  args: Args,
  context: Context,
  info: any
) => null | undefined | Output[] | Output | Promise<Output> | Promise<Output[]> | Promise<Output>[];

export const utilTypeDefs = /* GraphQL */ `
  scalar DateTime

  scalar Date

  type Avatar {
    head: String!
    torso: String!
    background: String!
    type: String
  }
`;
