import Koa from 'koa'
import { asClass } from 'awilix'
import { makeInvoker } from 'awilix-koa'

import { UserRepository } from '../../../domain/repository'
import { User } from '../../../domain/model'
import { AuthenticationService } from '../../../domain/services/AuthenticationService'
import { OAuth2Service } from '../../../infrastructure/services/OAuth2Service'
import { getContainerFromKoaContext } from '../util'
import { setAuthenticationError } from '../errors'

interface Dependencies {
  userRepository: UserRepository
  oauth2Service: OAuth2Service
}

const getAccessTokenFromHeaders = (
  request: Koa.Request
): string | undefined => {
  const authorizationHeader: string = request.headers.authorization || ''
  const [, accessToken] = authorizationHeader.split(' ')

  return accessToken
}

class AuthorizationMiddleware {
  private userRepository: UserRepository
  private oauth2Service: OAuth2Service

  public constructor({ userRepository, oauth2Service }: Dependencies) {
    this.userRepository = userRepository
    this.oauth2Service = oauth2Service
  }

  public authorize: Koa.Middleware = async (ctx, next) => {
    const accessToken = getAccessTokenFromHeaders(ctx.request)
    const container = getContainerFromKoaContext(ctx)

    let currentUser: User | null = null

    try {
      if (accessToken) {
        const oauthUser = await this.oauth2Service.getCurrentUser(accessToken)
        currentUser = await this.userRepository.findByEmail(oauthUser.email)

        // TODO: Throw if the user is not found?
      }

      container.register({
        authenticationService: asClass(AuthenticationService).inject(() => ({
          currentUser,
        })),
      })

      return next()
    } catch (err) {
      return setAuthenticationError(ctx)
    }
  }
}

const invoker = makeInvoker(AuthorizationMiddleware)

export const authorizeMiddleware = invoker('authorize')
