import qs from 'querystring'
import Koa from 'koa'
import Joi from '@hapi/joi'
import { makeInvoker } from 'awilix-koa'

import { CreateUserAccount } from '../../../../domain/usecase'
import { OAuth2Service } from '../../../services/OAuth2Service'
import { validateSchemaOrThrow } from '../../util'

interface AuthorizeQuery {
  redirect: string
}

interface Oauth2Query {
  code: string
  state: string
}

interface Dependencies {
  oauth2Service: OAuth2Service
  createUserAccount: CreateUserAccount
}

class OAuth2Middleware {
  private oauth2Service: OAuth2Service
  private createUserAccount: CreateUserAccount

  public constructor({ oauth2Service, createUserAccount }: Dependencies) {
    this.oauth2Service = oauth2Service
    this.createUserAccount = createUserAccount
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

    ctx.redirect(this.oauth2Service.getAuthorizeUrl(query.redirect))
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

    const {
      accessToken,
      refreshToken,
    } = await this.oauth2Service.getCredentials(code)

    const user = await this.oauth2Service.getCurrentUser(accessToken)

    await this.createUserAccount({
      email: user.email,
    })

    ctx.redirect(
      `${redirectUri}?${qs.stringify({
        accessToken,
        refreshToken,
      })}`
    )
  }
}

const invoker = makeInvoker(OAuth2Middleware)

export const redirectToLoginMiddleware = invoker('redirectToLogin')

export const handleOauth2CallbackMiddleware = invoker('handleOauth2Callback')
