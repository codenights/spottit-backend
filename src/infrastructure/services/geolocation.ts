import axios from 'axios'
import qs from 'querystring'

import { Location } from '../../domain/model'

interface Dependencies {
  openCageDataApiKey: string
}

export interface GeolocationService {
  getAddressForLocation: (location: Location) => Promise<string | null>
}

export const createGeolocationService = ({
  openCageDataApiKey,
}: Dependencies): GeolocationService => ({
  getAddressForLocation: location => {
    const params = {
      q: `${location.latitude}+${location.longitude}`,
      key: openCageDataApiKey,
    }

    return axios
      .get<{
        results: Array<{
          formatted: string
        }>
      }>(
        `https://api.opencagedata.com/geocode/v1/json?${qs.stringify(
          params,
          undefined,
          undefined,
          {
            encodeURIComponent: (x: string) => x,
          }
        )}`
      )
      .then(response => response.data)
      .then(data => {
        if (data.results.length === 0) {
          return null
        }

        return data.results[0].formatted
      })
  },
})
