import {
  CreateSpot,
  SearchSpots,
  GetSpot,
  LinkSocialAccount,
} from '../../../domain/usecase'
import { User } from '../../../domain/model'
import { GeolocationService } from '../../services/Geolocation'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
    searchSpots: SearchSpots
    getSpot: GetSpot
    linkSocialAccount: LinkSocialAccount
  }
  services: {
    geolocation: GeolocationService
  }
  currentUser: User | null
}
