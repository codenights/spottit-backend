import Koa from 'koa'

import * as oauth2 from './oauth2'

export const configureRoutes = (app: Koa): Koa => {
  oauth2.configureGoogleRoutes(app)

  return app
}
