import { CreateSpot } from '../../../domain/usecase'

export interface GraphlQlContext {
  usecases: {
    createSpot: CreateSpot
  }
}
