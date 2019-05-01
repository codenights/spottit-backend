import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import dotenv from 'dotenv'

import { schema } from './graphql'

dotenv.config()

const port = process.env.PORT
const server = new ApolloServer({ schema })
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
