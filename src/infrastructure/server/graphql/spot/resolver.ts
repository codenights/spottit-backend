import { Spot } from '../../../../domain/model'
import { GraphlQlContext } from '../types'

interface CreateSpotInput {
  input: {
    name: string
    description: string | null
    latitude: number
    longitude: number
  }
}

interface MutationResolver {
  createSpot: (
    parent: null,
    args: CreateSpotInput,
    context: GraphlQlContext
  ) => Promise<Spot>
}

const Mutation: MutationResolver = {
  createSpot: (_parent, { input }, context) =>
    context.usecases.createSpot({
      name: input.name,
      description: input.description,
      location: {
        latitude: input.latitude,
        longitude: input.longitude,
      },
    }),
}

export const SpotResolvers = {
  Query: {},
  Spot: {},
  Mutation,
}
