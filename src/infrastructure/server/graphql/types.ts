import {
  CreateSpot,
  SearchSpots,
  GetSpot,
  CreateUserAccount,
} from '../../../domain/usecase'
import { User } from '../../../domain/model'
import { GeolocationService } from '../../services/Geolocation'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
    searchSpots: SearchSpots
    getSpot: GetSpot
    createUserAccount: CreateUserAccount
  }
  services: {
    geolocation: GeolocationService
  }
  currentUser: User | null
}
