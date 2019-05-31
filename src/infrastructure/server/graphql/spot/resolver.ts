import { Spot as SpotModel, User as UserModel } from '../../../../domain/model'
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
  ) => Promise<SpotModel>
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
  ) => Promise<SpotModel[]>
  spot: (
    parent: null,
    args: { id: string },
    context: GraphlQlContext
  ) => Promise<SpotModel>
}

interface SpotResolver {
  author: (
    spot: SpotModel,
    args: null,
    ctx: GraphlQlContext
  ) => Promise<UserModel>
}

const Spot: SpotResolver = {
  author: async (spot, _args, context) => {
    const user = await context.repositories.user.findById(spot.authorId)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  },
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
      authorId: context.services.authentication.getCurrentUser().id,
    }),
}

export const SpotResolvers = {
  Spot,
  Query,
  Mutation,
}
