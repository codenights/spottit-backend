import axios from 'axios'
import qs from 'querystring'

import { Location } from '../../domain/model'

interface Dependencies {
  openCageDataApiKey: string
}

interface OpenCageDataResponse {
  results: Array<{
    formatted: string
  }>
}

// TODO: Move the interface to domain/services
export class GeolocationService {
  private clientId: string

  public constructor({ openCageDataApiKey }: Dependencies) {
    this.clientId = openCageDataApiKey
  }

  public getAddressForLocation(location: Location): Promise<string | null> {
    const params = {
      q: `${location.latitude}+${location.longitude}`,
      key: this.clientId,
    }

    return axios
      .get<OpenCageDataResponse>(
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
  }
}
