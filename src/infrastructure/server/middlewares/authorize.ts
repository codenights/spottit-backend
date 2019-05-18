import Koa from 'koa'
import { asValue } from 'awilix'
import { makeInvoker } from 'awilix-koa'

import { UserRepository } from '../../../domain/repository'
import { User } from '../../../domain/model'
import { GoogleAuthService } from '../../services/GoogleAuthService'
import { getContainerFromKoaContext } from '../util'

interface Dependencies {
  userRepository: UserRepository
  googleAuthService: GoogleAuthService
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
  private googleAuthService: GoogleAuthService

  public constructor({ userRepository, googleAuthService }: Dependencies) {
    this.userRepository = userRepository
    this.googleAuthService = googleAuthService
  }

  public authorize: Koa.Middleware = async (ctx, next) => {
    const accessToken = getAccessTokenFromHeaders(ctx.request)
    const container = getContainerFromKoaContext(ctx)

    let currentUser: User | null = null

    if (accessToken) {
      const googleUser = await this.googleAuthService.getCurrentUser(
        accessToken
      )
      currentUser = await this.userRepository.findByEmail(googleUser.email)
    }

    container.register({
      currentUser: asValue(currentUser),
    })
    return next()
  }
}

export const authorizationMiddleware = makeInvoker(AuthorizationMiddleware)(
  'authorize'
)
