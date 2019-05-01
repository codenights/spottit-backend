import * as uuid from 'node-uuid'

import { SpotRepository } from '../../application/repository'
import { Spot } from '../model'
import { Location } from '../model/Location'

type CreateSpotOptions = {
  name: string
  description: string | null
  location: Location
}

interface Options {
  spotRepository: SpotRepository
}

export interface CreateSpot {
  (options: CreateSpotOptions): Promise<Spot>
}

export const createSpot = ({ spotRepository }: Options): CreateSpot => ({
  name,
  description,
  location,
}) => {
  const id = uuid.v4()
  const spot = new Spot(id, name, description, location)

  return spotRepository.persist(spot)
}
