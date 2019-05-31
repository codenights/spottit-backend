import {
  CreateSpot,
  SearchSpots,
  GetSpot,
  CreateUserAccount,
} from '../../../domain/usecase'
import { UserRepository } from '../../../domain/repository'
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
    authentication: AuthenticationService
  }
  repositories: {
    user: UserRepository
  }
}
