import { SpotRepository } from '../../application/repository'
import { validateLatitude, validateLongitude } from '../validation/location'
import { Spot } from '../model'

interface Dependencies {
  spotRepository: SpotRepository
}

export type SearchSpots = (options: {
  latitude: number
  longitude: number
  radius: number
}) => Promise<Spot[]>

export const searchSpots = ({ spotRepository }: Dependencies): SearchSpots => ({
  longitude,
  latitude,
  radius,
}) => {
  validateLatitude(latitude)
  validateLongitude(longitude)

  return spotRepository.findByLocation(latitude, longitude, radius)
}
