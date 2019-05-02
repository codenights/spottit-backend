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

  input SpotsFilterInput {
    latitude: Float!
    longitude: Float!
    radius: Float!
  }

  extend type Query {
    spots(filter: SpotsFilterInput!): [Spot!]!
    spot(id: String!): Spot!
  }

  extend type Mutation {
    createSpot(input: CreateSpotInput!): Spot!
  }
`
