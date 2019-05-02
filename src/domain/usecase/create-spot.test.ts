import { SpotRepository } from '../../application/repository'
import { CreateSpot, createSpot } from './create-spot'

let usecase: CreateSpot
let spotRepository: SpotRepository

beforeEach(() => {
  spotRepository = {
    persist: jest.fn(spot => Promise.resolve(spot)),
    findByLocation: jest.fn().mockResolvedValue([]),
  }
  usecase = createSpot({ spotRepository })
})

describe('validation', () => {
  it('should throw when the latitude is < -90', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: -100,
          longitude: 0,
        },
      })
    ).toThrowError('The latitude must be in ]-90, 90[ (received -100).')
  })

  it('should throw when the latitude is -90', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: -90,
          longitude: 0,
        },
      })
    ).toThrowError('The latitude must be in ]-90, 90[ (received -90).')
  })

  it('should throw when the latitude is 90', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: 90,
          longitude: 0,
        },
      })
    ).toThrowError('The latitude must be in ]-90, 90[ (received 90).')
  })

  it('should throw when the latitude is > 90', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: 100,
          longitude: 0,
        },
      })
    ).toThrowError('The latitude must be in ]-90, 90[ (received 100).')
  })

  it('should throw when the longitude is < -180', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: 0,
          longitude: -190,
        },
      })
    ).toThrowError('The longitude must be in ]-180, 180[ (received -190).')
  })

  it('should throw when the longitude is -180', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: 0,
          longitude: -180,
        },
      })
    ).toThrowError('The longitude must be in ]-180, 180[ (received -180).')
  })

  it('should throw when the longitude is 180', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: 0,
          longitude: 180,
        },
      })
    ).toThrowError('The longitude must be in ]-180, 180[ (received 180).')
  })

  it('should throw when the longitude is > 180', () => {
    expect(() =>
      usecase({
        name: 'Spot',
        description: null,
        location: {
          latitude: 0,
          longitude: 190,
        },
      })
    ).toThrowError('The longitude must be in ]-180, 180[ (received 190).')
  })
})

it('should save a new spot', async () => {
  await usecase({
    description: 'some description',
    location: {
      latitude: 12.5,
      longitude: 98.5,
    },
    name: 'spot name',
  })

  expect(spotRepository.persist).toHaveBeenCalledTimes(1)
  expect(spotRepository.persist).toHaveBeenCalledWith(
    expect.objectContaining({
      id: expect.any(String),
      description: 'some description',
      name: 'spot name',
      location: {
        latitude: 12.5,
        longitude: 98.5,
      },
    })
  )
})

it('should resolve the new spot', async () => {
  const spot = await usecase({
    description: 'some description',
    location: {
      latitude: 12.5,
      longitude: 98.5,
    },
    name: 'spot name',
  })

  expect(spot.description).toEqual('some description')
  expect(spot.location).toEqual({
    latitude: 12.5,
    longitude: 98.5,
  })
  expect(spot.name).toEqual('spot name')
})
