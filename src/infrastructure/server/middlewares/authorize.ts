import Koa from 'koa'
import { asValue } from 'awilix'
import { makeInvoker } from 'awilix-koa'

import { UserRepository } from '../../../domain/repository'
import { User } from '../../../domain/model'
import { AuthService } from '../../../infrastructure/services/AuthService'
import { getContainerFromKoaContext } from '../util'
import { setAuthenticationError } from '../errors'

interface Dependencies {
  userRepository: UserRepository
  authService: AuthService
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
  private authService: AuthService

  public constructor({ userRepository, authService }: Dependencies) {
    this.userRepository = userRepository
    this.authService = authService
  }

  public authorize: Koa.Middleware = async (ctx, next) => {
    const accessToken = getAccessTokenFromHeaders(ctx.request)
    const container = getContainerFromKoaContext(ctx)

    let currentUser: User | null = null

    try {
      if (accessToken) {
        const googleUser = await this.authService.getCurrentUser(accessToken)
        currentUser = await this.userRepository.findByEmail(googleUser.email)
      }

      container.register({
        currentUser: asValue(currentUser),
      })

      return next()
    } catch (err) {
      return setAuthenticationError(ctx)
    }
  }
}

export const authorizationMiddleware = makeInvoker(AuthorizationMiddleware)(
  'authorize'
)
