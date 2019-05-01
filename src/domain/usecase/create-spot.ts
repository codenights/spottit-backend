import * as uuid from 'node-uuid'

import { SpotRepository } from '../../application/repository'
import { Spot } from '../model'

type CreateSpotOptions = {
  name: string
  description?: string
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
}) => {
  const id = uuid.v4()
  const spot = new Spot(id, name, description)

  return spotRepository.persist(spot)
}
