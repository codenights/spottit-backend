import { Location } from '../../../../domain/model'
import { GraphlQlContext } from '../types'

const LocationResolver = {
  address: (
    location: Location,
    _args: null,
    context: GraphlQlContext
  ): Promise<string | null> =>
    context.services.geolocation.getAddressForLocation(location).catch(err => {
      if (err.response) {
        // Most likely an API error due to payments
        return ''
      }

      throw err
    }),
}

export const LocationResolvers = {
  Query: {},
  Mutation: {},
  Location: LocationResolver,
}
