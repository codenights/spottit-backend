import qs from 'querystring'
import Koa from 'koa'
import router from 'koa-route'
import Joi from '@hapi/joi'

import { LinkSocialAccount } from '../../../../domain/usecase'
import { AuthService } from '../../../../infrastructure/services/AuthService'
import { validateSchemaOrThrow } from '../../util'
import { makeInvoker } from 'awilix-koa'

interface AuthorizeQuery {
  redirect: string
}

interface Oauth2Query {
  code: string
  state: string
}

interface Dependencies {
  authService: AuthService
  linkSocialAccount: LinkSocialAccount
}

class GoogleOauth2Api {
  private authService: AuthService
  private linkSocialAccount: LinkSocialAccount

  public constructor({ authService, linkSocialAccount }: Dependencies) {
    this.authService = authService
    this.linkSocialAccount = linkSocialAccount
  }

  public redirectToLogin: Koa.Middleware = ctx => {
    const query: AuthorizeQuery = ctx.request.query
    validateSchemaOrThrow(
      Joi.object()
        .keys({
          redirect: Joi.string().required(),
        })
        .required(),
      query
    )

    ctx.redirect(this.authService.getAuthorizeUrl(query.redirect))
  }

  public handleOauth2Callback: Koa.Middleware = async ctx => {
    const query: Oauth2Query = ctx.request.query
    validateSchemaOrThrow(
      Joi.object()
        .keys({
          code: Joi.string().required(),
          state: Joi.string().required(),
        })
        .unknown(true)
        .required(),
      query
    )

    const code = query.code
    const redirectUri = query.state

    const { accessToken, refreshToken } = await this.authService.getCredentials(
      code
    )

    const user = await this.authService.getCurrentUser(accessToken)

    await this.linkSocialAccount({
      email: user.email,
      googleId: user.sub,
    })

    ctx.redirect(
      `${redirectUri}?${qs.stringify({
        accessToken,
        refreshToken,
      })}`
    )
  }
}

const handler = makeInvoker(GoogleOauth2Api)

export const configureGoogleRoutes = (app: Koa): Koa =>
  app
    .use(router.get('/authorize/google', handler('redirectToLogin')))
    .use(router.get('/oauth2/google', handler('handleOauth2Callback')))
