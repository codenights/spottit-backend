import { SpotRepository } from '../repository'
import { SearchSpots, searchSpots } from './search-spots'
import { Spot } from '../model'

let usecase: SearchSpots
let spotRepository: SpotRepository

beforeEach(() => {
  spotRepository = {
    persist: jest.fn(),
    findByLocation: jest.fn().mockResolvedValue([
      new Spot(
        'spot-id',
        'Parc Robinson',
        null,
        {
          latitude: 0,
          longitude: 0,
        },
        'user-id-1'
      ),
    ]),
    findById: jest.fn(),
  }
  usecase = searchSpots({ spotRepository })
})

describe('validation', () => {
  it('should throw when the latitude is < -90', () => {
    expect(() =>
      usecase({
        latitude: -100,
        longitude: 0,
        radius: 10,
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received -100).')
  })

  it('should throw when the latitude is -90', () => {
    expect(() =>
      usecase({
        latitude: -90,
        longitude: 0,
        radius: 10,
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received -90).')
  })

  it('should throw when the latitude is 90', () => {
    expect(() =>
      usecase({
        latitude: 90,
        longitude: 0,
        radius: 10,
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received 90).')
  })

  it('should throw when the latitude is > 90', () => {
    expect(() =>
      usecase({
        latitude: 100,
        longitude: 0,
        radius: 10,
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received 100).')
  })

  it('should throw when the longitude is < -180', () => {
    expect(() =>
      usecase({
        latitude: 0,
        longitude: -181,
        radius: 10,
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received -181).')
  })

  it('should throw when the longitude is -180', () => {
    expect(() =>
      usecase({
        latitude: 0,
        longitude: -180,
        radius: 10,
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received -180).')
  })

  it('should throw when the longitude is 180', () => {
    expect(() =>
      usecase({
        latitude: 0,
        longitude: 180,
        radius: 10,
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received 180).')
  })

  it('should throw when the longitude is > 180', () => {
    expect(() =>
      usecase({
        latitude: 0,
        longitude: 181,
        radius: 10,
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received 181).')
  })
})

it('should find the spots', async () => {
  await usecase({
    latitude: 12.5,
    longitude: 120.6,
    radius: 30,
  })

  expect(spotRepository.findByLocation).toHaveBeenCalledTimes(1)
  expect(spotRepository.findByLocation).toHaveBeenCalledWith(12.5, 120.6, 30)
})

it('should resolve the new spot', async () => {
  const spots = await usecase({
    latitude: 12.5,
    longitude: 120.6,
    radius: 30,
  })

  expect(spots).toEqual([
    new Spot(
      'spot-id',
      'Parc Robinson',
      null,
      {
        latitude: 0,
        longitude: 0,
      },
      'user-id-1'
    ),
  ])
})
