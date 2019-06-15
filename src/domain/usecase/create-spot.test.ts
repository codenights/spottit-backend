import { SpotRepository } from '../repository'
import { AuthenticationService } from '../services/AuthenticationService'
import { CreateSpot, createSpot, CreateSpotOptions } from './create-spot'
import { User } from '../model'

const getTestSpot = (
  overrides: Partial<{
    name: string
    description: string | null
    latitude: number
    longitude: number
    authorId: string
    tags: string[]
  }> = {}
): CreateSpotOptions => ({
  name: overrides.name || 'Spot',
  description: overrides.description || null,
  location: {
    latitude: overrides.latitude || 0.1,
    longitude: overrides.longitude || 0.1,
  },
  authorId: overrides.authorId || 'author-id',
  tags: overrides.tags || ['tag-1'],
})

let usecase: CreateSpot
let spotRepository: SpotRepository
let authenticationService: AuthenticationService

beforeEach(() => {
  authenticationService = new AuthenticationService({
    currentUser: new User('user-id', 'jane.doe@gmail.com', 'janedoe'),
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
    expect(() => usecase(getTestSpot({ latitude: -100 }))).toThrow(
      'The latitude must be in ]-90, 90[ (received -100).'
    )
  })

  it('should throw when the latitude is -90', () => {
    expect(() => usecase(getTestSpot({ latitude: -90 }))).toThrow(
      'The latitude must be in ]-90, 90[ (received -90).'
    )
  })

  it('should throw when the latitude is 90', () => {
    expect(() => usecase(getTestSpot({ latitude: 90 }))).toThrow(
      'The latitude must be in ]-90, 90[ (received 90).'
    )
  })

  it('should throw when the latitude is > 90', () => {
    expect(() => usecase(getTestSpot({ latitude: 100 }))).toThrow(
      'The latitude must be in ]-90, 90[ (received 100).'
    )
  })

  it('should throw when the longitude is < -180', () => {
    expect(() => usecase(getTestSpot({ longitude: -190 }))).toThrow(
      'The longitude must be in ]-180, 180[ (received -190).'
    )
  })

  it('should throw when the longitude is -180', () => {
    expect(() => usecase(getTestSpot({ longitude: -180 }))).toThrow(
      'The longitude must be in ]-180, 180[ (received -180).'
    )
  })

  it('should throw when the longitude is 180', () => {
    expect(() => usecase(getTestSpot({ longitude: 180 }))).toThrow(
      'The longitude must be in ]-180, 180[ (received 180).'
    )
  })

  it('should throw when the longitude is > 180', () => {
    expect(() => usecase(getTestSpot({ longitude: 190 }))).toThrow(
      'The longitude must be in ]-180, 180[ (received 190).'
    )
  })

  it('should throw when no tags has been given', () => {
    expect(() => usecase(getTestSpot({ tags: [] }))).toThrow(
      'At least 1 tag is required'
    )
  })
})

describe('authentication', () => {
  it('should throw when the user is not logged in', () => {
    // Given
    authenticationService = new AuthenticationService({ currentUser: null })
    usecase = createSpot({ spotRepository, authenticationService })

    // When
    const fn = (): unknown => usecase(getTestSpot())

    // Then
    expect(fn).toThrow()
  })
})

it('should save a new spot', async () => {
  await usecase(
    getTestSpot({
      authorId: 'author-id',
      description: 'some description',
      latitude: 12.5,
      longitude: 98.5,
      name: 'spot name',
      tags: ['tag-1'],
    })
  )

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
      tags: ['tag-1'],
    })
  )
})

it('should resolve the new spot', async () => {
  const spot = await usecase(
    getTestSpot({
      authorId: 'author-id',
      description: 'some description',
      latitude: 12.5,
      longitude: 98.5,
      name: 'spot name',
      tags: ['tag-1'],
    })
  )

  expect(spot.description).toEqual('some description')
  expect(spot.location).toEqual({
    latitude: 12.5,
    longitude: 98.5,
  })
  expect(spot.name).toEqual('spot name')
  expect(spot.authorId).toEqual('author-id')
  expect(spot.tags).toEqual(['tag-1'])
})
