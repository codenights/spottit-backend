import axios from 'axios'

import { castToJestMock } from '../../test-utils'
import { GeolocationService } from './Geolocation'

jest.mock('axios')

let clientId: string
let service: GeolocationService

beforeEach(() => {
  clientId = 'client-id'
  service = new GeolocationService({ openCageDataApiKey: clientId })
})

describe('getAddressForLocation', () => {
  it('should call the correct URL', async () => {
    // Given
    castToJestMock(axios.get).mockResolvedValue({
      data: {
        results: [],
      },
    })

    // When
    await service.getAddressForLocation({
      latitude: 19.2,
      longitude: 55.9,
    })

    // Then
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.opencagedata.com/geocode/v1/json?q=19.2+55.9&key=client-id'
    )
  })

  it('should return the formatted address if existing', async () => {
    // Given
    castToJestMock(axios.get).mockResolvedValue({
      data: {
        results: [
          {
            formatted: '34 Avenue des Champs Elysées',
          },
          {
            formatted: '1 Avenue Henry Martin',
          },
        ],
      },
    })

    // When
    const result = await service.getAddressForLocation({
      latitude: 19.2,
      longitude: 55.9,
    })

    // Then
    expect(result).toEqual('34 Avenue des Champs Elysées')
  })

  it('should return null if it does not exist', async () => {
    // Given
    castToJestMock(axios.get).mockResolvedValue({
      data: {
        results: [],
      },
    })

    // When
    const result = await service.getAddressForLocation({
      latitude: 19.2,
      longitude: 55.9,
    })

    // Then
    expect(result).toEqual(null)
  })
})
