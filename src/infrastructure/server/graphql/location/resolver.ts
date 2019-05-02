import { Location } from '../../../../domain/model'
import { GraphlQlContext } from '../types'

interface LocationResolver {
  address: (
    parent: Location,
    _args: null,
    context: GraphlQlContext
  ) => Promise<String | null>
}

const Location: LocationResolver = {
  address: (location, _args, context) =>
    context.services.geolocation.getAddressForLocation(location),
}

export const LocationResolvers = {
  Query: {},
  Mutation: {},
  Location,
}
