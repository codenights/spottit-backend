import * as uuid from 'node-uuid'

import { Spot, Location } from '../model'
import { SpotRepository } from '../repository'
import { validateLatitude, validateLongitude } from '../validation/location'
import { AuthenticationService } from '../services/AuthenticationService'

export type CreateSpotOptions = {
  name: string
  description: string | null
  location: Location
  authorId: string
  tags: string[]
}

interface Dependencies {
  spotRepository: SpotRepository
  authenticationService: AuthenticationService
}

export type CreateSpot = (options: CreateSpotOptions) => Promise<Spot>

export const createSpot = ({
  spotRepository,
  authenticationService,
}: Dependencies): CreateSpot => ({
  name,
  description,
  location,
  authorId,
  tags,
}) => {
  authenticationService.throwIfNotLoggedIn()

  if (tags.length === 0) {
    throw new Error('At least 1 tag is required')
  }

  validateLatitude(location.latitude)
  validateLongitude(location.longitude)

  const id = uuid.v4()
  const spot = new Spot(id, name, description, location, authorId, tags)

  return spotRepository.persist(spot)
}
