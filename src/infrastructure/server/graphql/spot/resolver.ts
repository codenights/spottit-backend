import { Spot } from '../../../../domain/model'
import { GraphlQlContext } from '../types'

interface MutationResolver {
  createSpot: (
    parent: null,
    args: {
      input: {
        name: string
        description: string | null
        latitude: number
        longitude: number
      }
    },
    context: GraphlQlContext
  ) => Promise<Spot>
}

interface QueryResolver {
  spots: (
    parent: null,
    args: {
      filter: {
        latitude: number
        longitude: number
        radius: number
      }
    },
    context: GraphlQlContext
  ) => Promise<Spot[]>
  spot: (
    parent: null,
    args: { id: string },
    context: GraphlQlContext
  ) => Promise<Spot>
}

const Query: QueryResolver = {
  spots: (_parent, { filter }, context) =>
    context.usecases.searchSpots({
      latitude: filter.latitude,
      longitude: filter.longitude,
      radius: filter.radius,
    }),
  spot: (_parent, { id }, context) => context.usecases.getSpot({ id }),
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
  Spot: {},
  Query,
  Mutation,
}
