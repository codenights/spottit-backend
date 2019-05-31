import Koa from 'koa'
import router from 'koa-route'

import { refreshMiddleware } from './refresh'

export const configureRefresh = (app: Koa): Koa =>
  app.use(router.post('/refresh', refreshMiddleware))
