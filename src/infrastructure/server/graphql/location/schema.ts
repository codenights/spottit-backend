import { gql } from 'apollo-server-koa'

export const LocationSchema = gql`
  type Location {
    latitude: Float!
    longitude: Float!
    address: String
  }
`
