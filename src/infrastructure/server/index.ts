import Koa from 'koa'
import dotenv from 'dotenv'
import { createContainer, asFunction, asValue, asClass, Resolver } from 'awilix'

import {
  createSpot,
  searchSpots,
  getSpot,
  createUserAccount,
} from '../../domain/usecase'
import { FakerUsernameService } from '../../domain/services/FakerUsernameService'
import { SpotInMemory } from '../repository/SpotInMemory'
import { UserInMemory } from '../repository/UserInMemory'
import { GeolocationService } from '../services/Geolocation'
import { OAuth2Service } from '../services/OAuth2Service'
import { GoogleOAuth2Service } from '../services/GoogleOAuth2Service'
import { LocalOAuth2Service } from '../services/LocalOAuth2Service'
import { configureGraphql } from './graphql'
import { configureMiddlewares } from './middlewares'
import { configureRoutes } from './routes'

dotenv.config()

const identityProvider = process.env.IDENTITY_PROVIDER
const corsAllowedOrigin = process.env.CORS_ALLOWED_ORIGIN

let oauth2Service: Resolver<OAuth2Service>

if (identityProvider === 'local') {
  oauth2Service = asClass(LocalOAuth2Service)
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

  oauth2Service = asClass(GoogleOAuth2Service).inject(() => ({
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
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
  oauth2Service,
  usernameService: asClass(FakerUsernameService),
  geolocationService: asClass(GeolocationService),

  // Repositories
  spotRepository: asFunction(SpotInMemory).singleton(),
  userRepository: asFunction(UserInMemory).singleton(),

  // Use cases
  createSpot: asFunction(createSpot),
  searchSpots: asFunction(searchSpots),
  getSpot: asFunction(getSpot),
  createUserAccount: asFunction(createUserAccount),
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
