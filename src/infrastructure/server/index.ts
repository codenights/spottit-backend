import Koa from 'koa'
import dotenv from 'dotenv'
import { createContainer, asFunction, asValue, asClass } from 'awilix'

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

dotenv.config()

const googleClientId = process.env.OAUTH2_GOOGLE_API_KEY
const googleClientSecret = process.env.OAUTH2_GOOGLE_API_SECRET
const googleRedirectUri = process.env.OAUTH2_GOOGLE_REDIRECT_URI

if (!googleClientId) {
  throw new Error('Environment variable "OAUTH2_GOOGLE_API_KEY" is required')
}

if (!googleClientSecret) {
  throw new Error('Environment variable "OAUTH2_GOOGLE_API_SECRET" is required')
}

if (!googleRedirectUri) {
  throw new Error(
    'Environment variable "OAUTH2_GOOGLE_REDIRECT_URI" is required'
  )
}

const port = process.env.PORT
const container = createContainer()

container.register({
  // Configuration
  googleClientId: asValue(googleClientId),
  googleClientSecret: asValue(googleClientSecret),
  googleRedirectUri: asValue(googleRedirectUri),
  openCageDataApiKey: asValue(process.env.OPENCAGEDATA_API_KEY),

  // Services
  googleAuthService: asClass(GoogleAuthService),
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
