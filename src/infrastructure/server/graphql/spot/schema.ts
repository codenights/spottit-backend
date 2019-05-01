import { gql } from 'apollo-server-koa'

export const SpotSchema = gql`
  type Spot {
    id: String!
    name: String!
    description: String
  }

  input CreateSpotInput {
    name: String!
    description: String!
  }

  extend type Mutation {
    createSpot(input: CreateSpotInput!): Spot!
  }
`
