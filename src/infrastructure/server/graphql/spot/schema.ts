import { gql } from 'apollo-server-koa'

export const SpotSchema = gql`
  type Spot {
    id: String!
    name: String!
    description: String
    location: Location!
  }

  input CreateSpotInput {
    name: String!
    description: String
    latitude: Float!
    longitude: Float!
  }

  extend type Mutation {
    createSpot(input: CreateSpotInput!): Spot!
  }
`
