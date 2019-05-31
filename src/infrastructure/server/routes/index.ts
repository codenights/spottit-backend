import Koa from 'koa'

import * as refresh from './refresh'
import * as oauth2 from './oauth2'

export const configureRoutes = (app: Koa): Koa => {
  oauth2.configureOauth2(app)
  refresh.configureRefresh(app)

  return app
}
