import { CommentRepository } from '../../domain/repository'
import { Comment } from '../../domain/model'

interface Database {
  [key: string]: Comment
}

const database: Database = {}

export const CommentInMemory = (): CommentRepository => {
  return {
    persist: comment => {
      database[comment.id] = comment

      return Promise.resolve(comment)
    },
    findBySpotId: spotId =>
      Promise.resolve(
        Object.values(database).filter(comment => comment.spotId === spotId)
      ),
  }
}
