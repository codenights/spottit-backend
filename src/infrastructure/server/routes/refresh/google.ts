import Koa from 'koa'
import Joi from '@hapi/joi'

import { GoogleAuthService } from '../../../../infrastructure/services/GoogleAuthService'
import { validateSchemaOrThrow } from '../../util'
import { makeInvoker } from 'awilix-koa'

interface RefreshBody {
  refreshToken: string
}

interface Dependencies {
  googleAuthService: GoogleAuthService
}

class GoogleRefreshApi {
  private googleAuthService: GoogleAuthService

  public constructor({ googleAuthService }: Dependencies) {
    this.googleAuthService = googleAuthService
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

    const accessToken = await this.googleAuthService.refreshAccessToken(
      body.refreshToken
    )

    // eslint-disable-next-line no-param-reassign
    ctx.body = {
      accessToken,
    }
  }
}

const invoker = makeInvoker(GoogleRefreshApi)

export const refreshHandler = invoker('refreshAccessToken')
