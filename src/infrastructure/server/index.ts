import Koa from 'koa'
import dotenv from 'dotenv'
import { createContainer, asFunction, asValue, asClass, Resolver } from 'awilix'

import { configureMiddlewares } from './middlewares'
import { configureRoutes } from './routes'
import { SpotInMemory } from '../repository/SpotInMemory'
import {
  createSpot,
  searchSpots,
  getSpot,
  linkSocialAccount,
} from '../../domain/usecase'
import { GeolocationService } from '../services/Geolocation'
import { UserInMemory } from '../repository/UserInMemory'
import { GoogleAuthService } from '../services/GoogleAuthService'
import { configureGraphql } from './graphql'
import { LocalAuthService } from '../services/LocalAuthService'
import { AuthService } from '../services/AuthService'

dotenv.config()

const identityProvider = process.env.IDENTITY_PROVIDER
const corsAllowedOrigin = process.env.CORS_ALLOWED_ORIGIN

let authService: Resolver<AuthService>

if (identityProvider === 'local') {
  authService = asClass(LocalAuthService)
} else if (identityProvider === 'google') {
  const googleClientId = process.env.OAUTH2_GOOGLE_API_KEY
  const googleClientSecret = process.env.OAUTH2_GOOGLE_API_SECRET
  const googleRedirectUri = process.env.OAUTH2_GOOGLE_REDIRECT_URI

  if (!googleClientId) {
    throw new Error('Environment variable "OAUTH2_GOOGLE_API_KEY" is required')
  }

  if (!googleClientSecret) {
    throw new Error(
      'Environment variable "OAUTH2_GOOGLE_API_SECRET" is required'
    )
  }

  if (!googleRedirectUri) {
    throw new Error(
      'Environment variable "OAUTH2_GOOGLE_REDIRECT_URI" is required'
    )
  }

  authService = asClass(GoogleAuthService).inject(() => ({
    googleClientId: asValue(googleClientId),
    googleClientSecret: asValue(googleClientSecret),
    googleRedirectUri: asValue(googleRedirectUri),
  }))
} else {
  throw new Error('Environment variable "IDENTITY_PROVIDER" is required')
}

if (!corsAllowedOrigin) {
  throw new Error('Environment variable "CORS_ALLOWED_ORIGIN" is required')
}

const port = process.env.PORT
const container = createContainer()

container.register({
  // Configuration
  openCageDataApiKey: asValue(process.env.OPENCAGEDATA_API_KEY),
  corsAllowedOrigin: asValue(corsAllowedOrigin),

  // Services
  authService,
  geolocationService: asClass(GeolocationService),

  // Repositories
  spotRepository: asFunction(SpotInMemory).singleton(),
  userRepository: asFunction(UserInMemory).singleton(),

  // Use cases
  createSpot: asFunction(createSpot),
  searchSpots: asFunction(searchSpots),
  getSpot: asFunction(getSpot),
  linkSocialAccount: asFunction(linkSocialAccount),
})

const app = new Koa()

configureMiddlewares(app, container)
configureGraphql(app)
configureRoutes(app)

app.use(ctx => {
  // eslint-disable-next-line no-param-reassign
  ctx.body = 'Hello Koa'
})

app.listen({ port }, () => {
  // eslint-disable-next-line
  console.log(`🚀 Server ready at http://localhost:${port}`)
})
