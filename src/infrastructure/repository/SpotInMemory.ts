import { SpotRepository } from '../../application/repository'
import { Spot } from '../../domain/model'

interface Database {
  [key: string]: Spot
}

const database: Database = {}

export const SpotInMemory = (): SpotRepository => {
  return {
    persist: spot => {
      database[spot.id] = spot

      return Promise.resolve(spot)
    },
  }
}
