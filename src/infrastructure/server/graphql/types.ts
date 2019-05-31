import {
  CreateSpot,
  SearchSpots,
  GetSpot,
  CreateUserAccount,
} from '../../../domain/usecase'
import { AuthenticationService } from '../../../domain/services/AuthenticationService'
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
  authenticationService: AuthenticationService
}
