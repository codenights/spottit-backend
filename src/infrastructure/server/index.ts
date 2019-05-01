import Koa from 'koa'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-koa'
import { createContainer, asFunction } from 'awilix'

import { schema } from './graphql'
import { SpotInMemory } from '../repository/SpotInMemory'
import { createSpot } from '../../domain/usecase'
import { GraphlQlContext } from './graphql/types'

dotenv.config()

const port = process.env.PORT
const container = createContainer()

container.register({
  spotRepository: asFunction(SpotInMemory).singleton(),
  createSpot: asFunction(createSpot),
})

const server = new ApolloServer({
  schema,
  context: (): GraphlQlContext => {
    return {
      usecases: {
        createSpot: container.resolve('createSpot'),
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
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
})
