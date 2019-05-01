import { gql } from 'apollo-server-koa'
import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash.merge'

import { SpotSchema } from './spot/schema'
import { SpotResolvers } from './spot/resolver'

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [Query, SpotSchema],
  resolvers: merge(SpotResolvers),
})
