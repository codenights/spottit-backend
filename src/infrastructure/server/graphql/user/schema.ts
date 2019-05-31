import { gql } from 'apollo-server-koa'

export const UserSchema = gql`
  type User {
    id: String!
    email: String!
    username: String!
  }
`
