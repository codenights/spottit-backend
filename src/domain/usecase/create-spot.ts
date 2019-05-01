import * as uuid from 'node-uuid'

import { SpotRepository } from '../../application/repository'
import { Spot } from '../model'

type CreateSpotOptions = {
  name: string
  description?: string
}

export const createSpot = (spotRepository: SpotRepository) => ({
  name,
  description,
}: CreateSpotOptions): Promise<Spot> => {
  const id = uuid.v4()
  const spot = new Spot(id, name, description)

  return spotRepository.persist(spot)
}
