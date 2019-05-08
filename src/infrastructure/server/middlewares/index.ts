import Koa from 'koa'
import { AwilixContainer } from 'awilix'
import { scopePerRequest } from 'awilix-koa'

import { authorizationMiddleware } from './authorize'

export const configureMiddlewares = (
  app: Koa,
  container: AwilixContainer
): Koa => {
  app.use(scopePerRequest(container)).use(authorizationMiddleware)

  return app
}
