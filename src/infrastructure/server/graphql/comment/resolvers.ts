import {
  Comment as CommentModel,
  User as UserModel,
  Spot as SpotModel,
} from '../../../../domain/model'
import { GraphlQlContext } from '../types'

interface MutationResolver {
  addComment: (
    parent: null,
    args: {
      input: {
        spotId: string
        body: string
      }
    },
    context: GraphlQlContext
  ) => Promise<CommentModel>
}

interface CommentResolver {
  author: (
    comment: CommentModel,
    args: null,
    ctx: GraphlQlContext
  ) => Promise<UserModel>
  spot: (
    comment: CommentModel,
    args: null,
    ctx: GraphlQlContext
  ) => Promise<SpotModel>
}

const Comment: CommentResolver = {
  author: async (comment, _args, context) => {
    const user = await context.repositories.user.findById(comment.authorId)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  },
  spot: async (comment, _args, context) => {
    const spot = await context.repositories.spot.findById(comment.spotId)

    if (!spot) {
      throw new Error('Spot not found')
    }

    return spot
  },
}

const Mutation: MutationResolver = {
  addComment: (_parent, { input }, context) =>
    context.usecases.addComment({
      body: input.body,
      spotId: input.spotId,
    }),
}

export const CommentResolver = {
  Comment,
  Query: {},
  Mutation,
}
