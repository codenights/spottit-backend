import { CreateSpot, SearchSpots, GetSpot } from '../../../domain/usecase'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
    searchSpots: SearchSpots
    getSpot: GetSpot
  }
}
