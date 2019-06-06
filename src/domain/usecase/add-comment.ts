import * as uuid from 'node-uuid'

import { SpotRepository, CommentRepository } from '../repository'
import { Comment } from '../model/Comment'
import { AuthenticationService } from '../services'

interface AddCommentOptions {
  spotId: string
  body: string
}

interface Dependencies {
  spotRepository: SpotRepository
  commentRepository: CommentRepository
  authenticationService: AuthenticationService
}

export type AddComment = (options: AddCommentOptions) => Promise<Comment>

export const addComment = ({
  spotRepository,
  commentRepository,
  authenticationService,
}: Dependencies): AddComment => async ({ spotId, body }) => {
  authenticationService.throwIfNotLoggedIn()

  const spot = await spotRepository.findById(spotId)

  if (!spot) {
    throw new Error(`Spot "${spotId}" does not exist"`)
  }

  if (!body.trim()) {
    throw new Error('Comment body cannot be empty')
  }

  const commentId = uuid.v4()
  const user = authenticationService.getCurrentUser()
  const comment = new Comment(commentId, user.id, spot.id, body)

  await commentRepository.persist(comment)

  return comment
}
