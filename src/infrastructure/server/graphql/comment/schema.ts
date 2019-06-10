import { gql } from 'apollo-server-koa'

export const CommentSchema = gql`
  type Comment {
    id: String!
    author: User!
    spot: Spot!
    body: String!
    createdAt: String!
  }

  input AddCommentInput {
    spotId: String!
    body: String!
  }

  extend type Mutation {
    addComment(input: AddCommentInput!): Comment
  }
`
