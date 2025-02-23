import { getModelName } from '@/utils/utils';
import { IResolvers } from '@graphql-tools/utils';
import { loaderByType } from '../dataloader';
import { Resolver } from './util.resolver';

export type DbObject = { id: number };

export const idResolver: Resolver<DbObject, any, number> = async ({ id }, _, __) => id;

export const globalIdResolver = (type: string): Resolver<DbObject, any, string> => {
  return async ({ id }, _, __) => encodeId(`${type}-${id}`);
};

// export const encodeId = (id: string) => Buffer.from(id, 'base64').toString();

// export const decodeId = (id: string) => Buffer.from(id, 'base64').toString();

export const encodeId = (id: string) => btoa(id);

export const decodeId = (id: string) => atob(id);

/*
  type Query {
    node(id: ID!): Node
  }
*/

const nodeResolver: Resolver<any, { id: string }, DbObject | null> = async (_, { id }, { loaders }) => {
  const gid = decodeId(id);
  const items = gid.split('-');
  if (items.length !== 2) return null;
  const [type, objId] = items;
  const objectId = parseInt(objId);
  if (Number.isNaN(objectId)) return null;
  const loader = loaderByType(loaders, type);
  if (!loader) return null;
  return loader.load(objectId);
};

const typeResolver: Resolver<DbObject, any, string | null> = async (object, _, __) => {
  return getModelName(object);
};

export const nodeResolvers: IResolvers = {
  Query: {
    node: nodeResolver,
  },
  Node: {
    __resolveType: typeResolver,
  },
};
