import { SpotRepository } from '../repository'
import { AuthenticationService } from '../services/AuthenticationService'
import { CreateSpot, createSpot } from './create-spot'
import { User } from '../model'

let usecase: CreateSpot
let spotRepository: SpotRepository
let authenticationService: AuthenticationService

beforeEach(() => {
  authenticationService = new AuthenticationService({
    currentUser: new User('user-id', 'jane.doe@gmail.com'),
  })
  spotRepository = {
    persist: jest.fn(spot => Promise.resolve(spot)),
    findByLocation: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
  }
  usecase = createSpot({ spotRepository, authenticationService })
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
        authorId: 'author-id',
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received -100).')
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
        authorId: 'author-id',
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received -90).')
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
        authorId: 'author-id',
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received 90).')
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
        authorId: 'author-id',
      })
    ).toThrow('The latitude must be in ]-90, 90[ (received 100).')
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
        authorId: 'author-id',
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received -190).')
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
        authorId: 'author-id',
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received -180).')
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
        authorId: 'author-id',
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received 180).')
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
        authorId: 'author-id',
      })
    ).toThrow('The longitude must be in ]-180, 180[ (received 190).')
  })
})

describe('authentication', () => {
  it('should throw when the user is not logged in', () => {
    // Given
    authenticationService = new AuthenticationService({ currentUser: null })
    usecase = createSpot({ spotRepository, authenticationService })

    // When
    const fn = (): unknown =>
      usecase({
        description: null,
        location: {
          latitude: 0.1,
          longitude: 1.0,
        },
        name: 'Spot name',
        authorId: 'author-id',
      })

    // Then
    expect(fn).toThrow()
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
    authorId: 'author-id',
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
    authorId: 'author-id',
  })

  expect(spot.description).toEqual('some description')
  expect(spot.location).toEqual({
    latitude: 12.5,
    longitude: 98.5,
  })
  expect(spot.name).toEqual('spot name')
  expect(spot.authorId).toEqual('author-id')
})
