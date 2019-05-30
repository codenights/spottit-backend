import Koa from 'koa'
import Joi from '@hapi/joi'
import { makeInvoker } from 'awilix-koa'

import { AuthService } from '../../../../infrastructure/services/AuthService'
import { validateSchemaOrThrow } from '../../util'

interface RefreshBody {
  refreshToken: string
}

interface Dependencies {
  authService: AuthService
}

class GoogleRefreshApi {
  private authService: AuthService

  public constructor({ authService }: Dependencies) {
    this.authService = authService
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

    const accessToken = await this.authService.refreshAccessToken(
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
