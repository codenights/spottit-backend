import Koa from 'koa'
import router from 'koa-route'

import {
  redirectToLoginMiddleware,
  handleOauth2CallbackMiddleware,
} from './oauth2'

export const configureOauth2 = (app: Koa): Koa =>
  app
    .use(router.get('/login', redirectToLoginMiddleware))
    .use(router.get('/oauth2/callback', handleOauth2CallbackMiddleware))
