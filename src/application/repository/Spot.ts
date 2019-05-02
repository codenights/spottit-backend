import { Spot } from '../../domain/model'

export interface SpotRepository {
  persist: (spot: Spot) => Promise<Spot>
  findByLocation: (
    latitude: number,
    longitude: number,
    radius: number
  ) => Promise<Spot[]>
  findById: (id: string) => Promise<Spot | null>
}
