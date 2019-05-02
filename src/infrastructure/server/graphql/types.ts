import { CreateSpot, SearchSpots } from '../../../domain/usecase'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
    searchSpots: SearchSpots
  }
}
