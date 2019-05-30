import Koa from 'koa'
import router from 'koa-route'

import { refreshHandler } from './google'

export const configureRefresh = (app: Koa): Koa =>
  app.use(router.post('/refresh', refreshHandler))
