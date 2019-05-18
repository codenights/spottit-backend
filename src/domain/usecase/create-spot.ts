import * as uuid from 'node-uuid'

import { SpotRepository } from '../repository'
import { validateLatitude, validateLongitude } from '../validation/location'
import { Spot, Location } from '../model'

type CreateSpotOptions = {
  name: string
  description: string | null
  location: Location
}

interface Dependencies {
  spotRepository: SpotRepository
}

export type CreateSpot = (options: CreateSpotOptions) => Promise<Spot>

export const createSpot = ({ spotRepository }: Dependencies): CreateSpot => ({
  name,
  description,
  location,
}) => {
  validateLatitude(location.latitude)
  validateLongitude(location.longitude)

  const id = uuid.v4()
  const spot = new Spot(id, name, description, location)

  return spotRepository.persist(spot)
}
