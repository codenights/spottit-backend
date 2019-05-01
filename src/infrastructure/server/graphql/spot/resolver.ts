import { Spot } from '../../../../domain/model'
import * as usecases from '../../../../domain/usecase'
import { SpotInMemory } from '../../../../infrastructure/repository/SpotInMemory'

interface CreateSpotInput {
  input: {
    name: string
    description?: string
  }
}

interface MutationResolver {
  createSpot: (parent: null, args: CreateSpotInput) => Promise<Spot>
}

const Mutation: MutationResolver = {
  createSpot: (_parent, { input }) =>
    usecases.createSpot(SpotInMemory())({
      name: input.name,
      description: input.description,
    }),
}

export const SpotResolvers = {
  Query: {},
  Spot: {},
  Mutation,
}
