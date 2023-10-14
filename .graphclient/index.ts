// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import type { GetMeshOptions } from "@graphql-mesh/runtime";
import type { YamlConfig } from "@graphql-mesh/types";
import { PubSub } from "@graphql-mesh/utils";
import { DefaultLogger } from "@graphql-mesh/utils";
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from "@whatwg-node/fetch";

import { MeshResolvedSource } from "@graphql-mesh/runtime";
import { MeshTransform, MeshPlugin } from "@graphql-mesh/types";
import GraphqlHandler from "@graphql-mesh/graphql";
import UsePollingLive from "@graphprotocol/client-polling-live";
import BareMerger from "@graphql-mesh/merger-bare";
import { createMeshHTTPHandler, MeshHTTPHandler } from "@graphql-mesh/http";
import {
  getMesh,
  ExecuteMeshFn,
  SubscribeMeshFn,
  MeshContext as BaseMeshContext,
  MeshInstance,
} from "@graphql-mesh/runtime";
import { MeshStore, FsStoreStorageAdapter } from "@graphql-mesh/store";
import { path as pathModule } from "@graphql-mesh/cross-helpers";
import { ImportFn } from "@graphql-mesh/types";
import type { Uniswapv2Types } from "./sources/uniswapv2/types";
import * as importedModule$0 from "./sources/uniswapv2/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type Game = {
  id: Scalars["ID"];
  address: Scalars["String"];
  state: Scalars["String"];
  creator: Scalars["String"];
};

export type Game_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  address?: InputMaybe<Scalars["String"]>;
  address_not?: InputMaybe<Scalars["String"]>;
  address_gt?: InputMaybe<Scalars["String"]>;
  address_lt?: InputMaybe<Scalars["String"]>;
  address_gte?: InputMaybe<Scalars["String"]>;
  address_lte?: InputMaybe<Scalars["String"]>;
  address_in?: InputMaybe<Array<Scalars["String"]>>;
  address_not_in?: InputMaybe<Array<Scalars["String"]>>;
  address_contains?: InputMaybe<Scalars["String"]>;
  address_contains_nocase?: InputMaybe<Scalars["String"]>;
  address_not_contains?: InputMaybe<Scalars["String"]>;
  address_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  address_starts_with?: InputMaybe<Scalars["String"]>;
  address_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  address_not_starts_with?: InputMaybe<Scalars["String"]>;
  address_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  address_ends_with?: InputMaybe<Scalars["String"]>;
  address_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  address_not_ends_with?: InputMaybe<Scalars["String"]>;
  address_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<Scalars["String"]>;
  state_not?: InputMaybe<Scalars["String"]>;
  state_gt?: InputMaybe<Scalars["String"]>;
  state_lt?: InputMaybe<Scalars["String"]>;
  state_gte?: InputMaybe<Scalars["String"]>;
  state_lte?: InputMaybe<Scalars["String"]>;
  state_in?: InputMaybe<Array<Scalars["String"]>>;
  state_not_in?: InputMaybe<Array<Scalars["String"]>>;
  state_contains?: InputMaybe<Scalars["String"]>;
  state_contains_nocase?: InputMaybe<Scalars["String"]>;
  state_not_contains?: InputMaybe<Scalars["String"]>;
  state_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  state_starts_with?: InputMaybe<Scalars["String"]>;
  state_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  state_not_starts_with?: InputMaybe<Scalars["String"]>;
  state_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  state_ends_with?: InputMaybe<Scalars["String"]>;
  state_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  state_not_ends_with?: InputMaybe<Scalars["String"]>;
  state_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  creator?: InputMaybe<Scalars["String"]>;
  creator_not?: InputMaybe<Scalars["String"]>;
  creator_gt?: InputMaybe<Scalars["String"]>;
  creator_lt?: InputMaybe<Scalars["String"]>;
  creator_gte?: InputMaybe<Scalars["String"]>;
  creator_lte?: InputMaybe<Scalars["String"]>;
  creator_in?: InputMaybe<Array<Scalars["String"]>>;
  creator_not_in?: InputMaybe<Array<Scalars["String"]>>;
  creator_contains?: InputMaybe<Scalars["String"]>;
  creator_contains_nocase?: InputMaybe<Scalars["String"]>;
  creator_not_contains?: InputMaybe<Scalars["String"]>;
  creator_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  creator_starts_with?: InputMaybe<Scalars["String"]>;
  creator_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  creator_not_starts_with?: InputMaybe<Scalars["String"]>;
  creator_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  creator_ends_with?: InputMaybe<Scalars["String"]>;
  creator_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  creator_not_ends_with?: InputMaybe<Scalars["String"]>;
  creator_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Game_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Game_filter>>>;
};

export type Game_orderBy = "id" | "address" | "state" | "creator";

/** Defines the order direction, either ascending or descending */
export type OrderDirection = "asc" | "desc";

export type Player = {
  id: Scalars["ID"];
};

export type Player_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Player_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Player_filter>>>;
};

export type Player_orderBy = "id";

export type Query = {
  player?: Maybe<Player>;
  players: Array<Player>;
  game?: Maybe<Game>;
  games: Array<Game>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};

export type QueryplayerArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryplayersArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Player_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Player_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerygameArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerygamesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Game_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Game_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  player?: Maybe<Player>;
  players: Array<Player>;
  game?: Maybe<Game>;
  games: Array<Game>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};

export type SubscriptionplayerArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionplayersArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Player_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Player_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiongameArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiongamesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Game_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Game_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | "allow"
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | "deny";

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigDecimal: ResolverTypeWrapper<Scalars["BigDecimal"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Bytes: ResolverTypeWrapper<Scalars["Bytes"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Game: ResolverTypeWrapper<Game>;
  Game_filter: Game_filter;
  Game_orderBy: Game_orderBy;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Int8: ResolverTypeWrapper<Scalars["Int8"]>;
  OrderDirection: OrderDirection;
  Player: ResolverTypeWrapper<Player>;
  Player_filter: Player_filter;
  Player_orderBy: Player_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Subscription: ResolverTypeWrapper<{}>;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars["BigDecimal"];
  BigInt: Scalars["BigInt"];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars["Boolean"];
  Bytes: Scalars["Bytes"];
  Float: Scalars["Float"];
  Game: Game;
  Game_filter: Game_filter;
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  Int8: Scalars["Int8"];
  Player: Player;
  Player_filter: Player_filter;
  Query: {};
  String: Scalars["String"];
  Subscription: {};
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = {};

export type entityDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = entityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars["String"];
};

export type subgraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = subgraphIdDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars["String"];
};

export type derivedFromDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = derivedFromDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigDecimal"], any> {
  name: "BigDecimal";
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Bytes"], any> {
  name: "Bytes";
}

export type GameResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Game"] = ResolversParentTypes["Game"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  address?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Int8"], any> {
  name: "Int8";
}

export type PlayerResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Player"] = ResolversParentTypes["Player"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  player?: Resolver<
    Maybe<ResolversTypes["Player"]>,
    ParentType,
    ContextType,
    RequireFields<QueryplayerArgs, "id" | "subgraphError">
  >;
  players?: Resolver<
    Array<ResolversTypes["Player"]>,
    ParentType,
    ContextType,
    RequireFields<QueryplayersArgs, "skip" | "first" | "subgraphError">
  >;
  game?: Resolver<
    Maybe<ResolversTypes["Game"]>,
    ParentType,
    ContextType,
    RequireFields<QuerygameArgs, "id" | "subgraphError">
  >;
  games?: Resolver<
    Array<ResolversTypes["Game"]>,
    ParentType,
    ContextType,
    RequireFields<QuerygamesArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: Resolver<Maybe<ResolversTypes["_Meta_"]>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = ResolversObject<{
  player?: SubscriptionResolver<
    Maybe<ResolversTypes["Player"]>,
    "player",
    ParentType,
    ContextType,
    RequireFields<SubscriptionplayerArgs, "id" | "subgraphError">
  >;
  players?: SubscriptionResolver<
    Array<ResolversTypes["Player"]>,
    "players",
    ParentType,
    ContextType,
    RequireFields<SubscriptionplayersArgs, "skip" | "first" | "subgraphError">
  >;
  game?: SubscriptionResolver<
    Maybe<ResolversTypes["Game"]>,
    "game",
    ParentType,
    ContextType,
    RequireFields<SubscriptiongameArgs, "id" | "subgraphError">
  >;
  games?: SubscriptionResolver<
    Array<ResolversTypes["Game"]>,
    "games",
    ParentType,
    ContextType,
    RequireFields<SubscriptiongamesArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "_meta",
    ParentType,
    ContextType,
    Partial<Subscription_metaArgs>
  >;
}>;

export type _Block_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Block_"] = ResolversParentTypes["_Block_"]
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Meta_"] = ResolversParentTypes["_Meta_"]
> = ResolversObject<{
  block?: Resolver<ResolversTypes["_Block_"], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Game?: GameResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = Uniswapv2Types.Context & BaseMeshContext;

import { fileURLToPath } from "@graphql-mesh/utils";
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), "..");

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId)
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  switch (relativeModuleId) {
    case ".graphclient/sources/uniswapv2/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore(
  ".graphclient",
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "ts",
  }),
  {
    readonly: true,
    validate: false,
  }
);

export const rawServeConfig: YamlConfig.Config["serve"] = undefined as any;
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child("sources");
  const logger = new DefaultLogger("GraphClient");
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child("cache"),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const uniswapv2Transforms = [];
  const additionalTypeDefs = [] as any[];
  const uniswapv2Handler = new GraphqlHandler({
    name: "uniswapv2",
    config: { endpoint: "https://subgraph.inco.network/subgraphs/name/framed/subgraphtest" },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("uniswapv2"),
    logger: logger.child("uniswapv2"),
    importFn,
  });
  sources[0] = {
    name: "uniswapv2",
    handler: uniswapv2Handler,
    transforms: uniswapv2Transforms,
  };
  additionalEnvelopPlugins[0] = await UsePollingLive({
    ...{
      defaultInterval: 1000,
    },
    logger: logger.child("pollingLive"),
    cache,
    pubsub,
    baseDir,
    importFn,
  });
  const additionalResolvers = [] as any[];
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child("bareMerger"),
    store: rootStore.child("bareMerger"),
  });

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions()
      .then((meshOptions) => getMesh(meshOptions))
      .then((mesh) => {
        const id = mesh.pubsub.subscribe("destroy", () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) =>
  getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
