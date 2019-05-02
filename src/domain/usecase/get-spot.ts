import { SpotRepository } from '../../application/repository'
import { Spot } from '../model'

interface Dependencies {
  spotRepository: SpotRepository
}

export type GetSpot = (options: { id: string }) => Promise<Spot>

export const getSpot = ({ spotRepository }: Dependencies): GetSpot => async ({
  id,
}) => {
  const spot = await spotRepository.findById(id)

  if (!spot) {
    throw new Error(`Spot ${id} was not found`)
  }

  return spot
}
