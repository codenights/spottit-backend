import * as uuid from 'node-uuid'

import { SpotRepository } from '../../application/repository'
import { Spot } from '../model'
import { Location } from '../model/Location'

type CreateSpotOptions = {
  name: string
  description: string | null
  location: Location
}

interface Dependencies {
  spotRepository: SpotRepository
}

export interface CreateSpot {
  (options: CreateSpotOptions): Promise<Spot>
}

export const createSpot = ({ spotRepository }: Dependencies): CreateSpot => ({
  name,
  description,
  location,
}) => {
  if (location.latitude <= -90 || location.latitude >= 90) {
    throw new Error(
      `The latitude must be in ]-90, 90[ (received ${location.latitude}).`
    )
  }

  if (location.longitude <= -180 || location.longitude >= 180) {
    throw new Error(
      `The longitude must be in ]-180, 180[ (received ${location.longitude}).`
    )
  }

  const id = uuid.v4()
  const spot = new Spot(id, name, description, location)

  return spotRepository.persist(spot)
}
