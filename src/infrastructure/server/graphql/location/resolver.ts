import { Location } from '../../../../domain/model'
import { GraphlQlContext } from '../types'

const LocationResolver = {
  address: (
    location: Location,
    _args: null,
    context: GraphlQlContext
  ): Promise<string | null> =>
    context.services.geolocation.getAddressForLocation(location),
}

export const LocationResolvers = {
  Query: {},
  Mutation: {},
  Location: LocationResolver,
}
