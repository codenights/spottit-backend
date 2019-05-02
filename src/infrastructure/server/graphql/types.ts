import { CreateSpot, SearchSpots, GetSpot } from '../../../domain/usecase'
import { GeolocationService } from '../../services/geolocation'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
    searchSpots: SearchSpots
    getSpot: GetSpot
  }
  services: {
    geolocation: GeolocationService
  }
}
