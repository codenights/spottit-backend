import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-koa'
import merge from 'lodash.merge'
import Koa from 'koa'

import { SpotSchema } from './spot/schema'
import { LocationSchema } from './location/schema'
import { SpotResolvers } from './spot/resolver'
import { LocationResolvers } from './location/resolver'
import { GraphlQlContext } from './types'
import { getContainerFromKoaContext } from '../util'

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

const schema = makeExecutableSchema({
  typeDefs: [Query, SpotSchema, LocationSchema],
  // @ts-ignore
  resolvers: merge(SpotResolvers, LocationResolvers),
})

export const configureGraphql = (app: Koa): Koa => {
  const server = new ApolloServer({
    schema,
    context: ({ ctx: koaContext }): GraphlQlContext => {
      const container = getContainerFromKoaContext(koaContext)

      return {
        currentUser: container.resolve('currentUser'),
        usecases: {
          createSpot: container.resolve('createSpot'),
          searchSpots: container.resolve('searchSpots'),
          getSpot: container.resolve('getSpot'),
          linkSocialAccount: container.resolve('linkSocialAccount'),
        },
        services: {
          geolocation: container.resolve('geolocationService'),
        },
      }
    },
  })

  server.applyMiddleware({ app })

  return app
}
