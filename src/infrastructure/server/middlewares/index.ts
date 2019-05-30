import Koa from 'koa'
import { AwilixContainer } from 'awilix'
import { scopePerRequest } from 'awilix-koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'

import { authorizationMiddleware } from './authorize'

export const configureMiddlewares = (
  app: Koa,
  container: AwilixContainer
): Koa => {
  app
    .use(
      cors({
        origin: container.resolve<string>('corsAllowedOrigin'),
      })
    )
    .use(bodyParser())
    .use(scopePerRequest(container))
    .use(authorizationMiddleware)

  return app
}
