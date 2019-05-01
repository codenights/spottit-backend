import { Spot } from '../../../../domain/model'
import { GraphlQlContext } from '../types'

interface CreateSpotInput {
  input: {
    name: string
    description?: string
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
    }),
}

export const SpotResolvers = {
  Query: {},
  Spot: {},
  Mutation,
}
