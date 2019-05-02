import { gql, makeExecutableSchema } from 'apollo-server-koa'
import merge from 'lodash.merge' // eslint-disable-line

import { SpotSchema } from './spot/schema'
import { LocationSchema } from './location/schema'
import { SpotResolvers } from './spot/resolver'
import { LocationResolvers } from './location/resolver'

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [Query, SpotSchema, LocationSchema],
  // @ts-ignore
  resolvers: merge(SpotResolvers, LocationResolvers),
})
