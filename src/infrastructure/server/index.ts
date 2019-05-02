import Koa from 'koa'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-koa'
import { createContainer, asFunction, asValue } from 'awilix'

import { schema } from './graphql'
import { SpotInMemory } from '../repository/SpotInMemory'
import { createSpot, searchSpots, getSpot } from '../../domain/usecase'
import { createGeolocationService } from '../services/geolocation'
import { GraphlQlContext } from './graphql/types'

dotenv.config()

const port = process.env.PORT
const container = createContainer()

container.register({
  spotRepository: asFunction(SpotInMemory).singleton(),
  createSpot: asFunction(createSpot),
  searchSpots: asFunction(searchSpots),
  getSpot: asFunction(getSpot),
  geolocationService: asFunction(createGeolocationService),
  openCageDataApiKey: asValue(process.env.OPENCAGEDATA_API_KEY),
})

const server = new ApolloServer({
  schema,
  context: (): GraphlQlContext => {
    return {
      usecases: {
        createSpot: container.resolve('createSpot'),
        searchSpots: container.resolve('searchSpots'),
        getSpot: container.resolve('getSpot'),
      },
      services: {
        geolocation: container.resolve('geolocationService'),
      },
    }
  },
})
const app = new Koa()

server.applyMiddleware({ app })

app.use(ctx => {
  // eslint-disable-next-line no-param-reassign
  ctx.body = 'Hello Koa'
})

app.listen({ port }, () => {
  // eslint-disable-next-line
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
})
