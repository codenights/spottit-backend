import { Spot } from '../../domain/model'

export interface SpotRepository {
  persist: (spot: Spot) => Promise<Spot>
}
