import Koa from 'koa'
import Joi from '@hapi/joi'
import { makeInvoker } from 'awilix-koa'

import { OAuth2Service } from '../../../../infrastructure/services/OAuth2Service'
import { validateSchemaOrThrow } from '../../util'

interface RefreshBody {
  refreshToken: string
}

interface Dependencies {
  oauth2Service: OAuth2Service
}

class RefreshMiddleware {
  private oauth2Service: OAuth2Service

  public constructor({ oauth2Service }: Dependencies) {
    this.oauth2Service = oauth2Service
  }

  public refreshAccessToken: Koa.Middleware = async ctx => {
    const body: RefreshBody = ctx.request.body
    validateSchemaOrThrow(
      Joi.object()
        .keys({
          refreshToken: Joi.string().required(),
        })
        .required(),
      body
    )

    const accessToken = await this.oauth2Service.refreshAccessToken(
      body.refreshToken
    )

    // eslint-disable-next-line no-param-reassign
    ctx.body = {
      accessToken,
    }
  }
}

const invoker = makeInvoker(RefreshMiddleware)

export const refreshMiddleware = invoker('refreshAccessToken')
