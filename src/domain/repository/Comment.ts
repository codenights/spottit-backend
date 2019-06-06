import { Comment } from '../model'

export interface CommentRepository {
  persist: (comment: Comment) => Promise<Comment>
  findBySpotId: (spotId: string) => Promise<Comment[]>
}
