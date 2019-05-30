import Koa from 'koa'

import * as refresh from './refresh'
import * as oauth2 from './oauth2'

export const configureRoutes = (app: Koa): Koa => {
  refresh.configureRefresh(app)
  oauth2.configureGoogleRoutes(app)

  return app
}
