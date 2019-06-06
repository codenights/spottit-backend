import {
  CreateSpot,
  SearchSpots,
  GetSpot,
  CreateUserAccount,
} from '../../../domain/usecase'
import { UserRepository, SpotRepository } from '../../../domain/repository'
import { AuthenticationService } from '../../../domain/services/AuthenticationService'
import { GeolocationService } from '../../services/Geolocation'
import { AddComment } from 'src/domain/usecase/add-comment'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
    searchSpots: SearchSpots
    getSpot: GetSpot
    createUserAccount: CreateUserAccount
    addComment: AddComment
  }
  services: {
    geolocation: GeolocationService
    authentication: AuthenticationService
  }
  repositories: {
    user: UserRepository
    spot: SpotRepository
  }
}
