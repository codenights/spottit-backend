import { AddComment, addComment } from './add-comment'
import { SpotRepository, CommentRepository } from '../repository'
import { Spot, User } from '../model'
import { AuthenticationService } from '../services'

let usecase: AddComment
let spotRepository: SpotRepository
let authenticationService: AuthenticationService
let commentRepository: CommentRepository

const getTestSpot = (): Spot =>
  new Spot(
    'spot-id',
    'spot-name',
    null,
    {
      latitude: 0.1,
      longitude: 1,
    },
    'author-id'
  )

const getTestUser = (): User =>
  new User('user-id', 'jane.doe@gmail.com', 'janedoe')

beforeEach(() => {
  authenticationService = new AuthenticationService({
    currentUser: getTestUser(),
  })
  spotRepository = {
    persist: jest.fn(),
    findById: jest.fn(),
    findByLocation: jest.fn(),
  }
  commentRepository = {
    persist: jest.fn(),
    findBySpotId: jest.fn(),
  }
})

describe('validation', () => {
  it('should throw when the spot does not exist', () => {
    // Given
    ;(spotRepository.findById as jest.Mock).mockResolvedValue(null)

    usecase = addComment({
      spotRepository,
      commentRepository,
      authenticationService,
    })

    // Then
    return expect(
      usecase({
        spotId: 'spot-id',
        body: 'comment-body',
      })
    ).rejects.toThrow('Spot "spot-id" does not exist')
  })

  it('should throw when the body is an empty string', () => {
    // Given
    ;(spotRepository.findById as jest.Mock).mockResolvedValue(getTestSpot())
    const body = ''

    usecase = addComment({
      spotRepository,
      commentRepository,
      authenticationService,
    })

    // Then
    return expect(
      usecase({
        spotId: 'spot-id',
        body,
      })
    ).rejects.toThrow('Comment body cannot be empty')
  })

  it('should throw when the body is "    "', () => {
    // Given
    ;(spotRepository.findById as jest.Mock).mockResolvedValue(getTestSpot())
    const body = '    '

    usecase = addComment({
      spotRepository,
      commentRepository,
      authenticationService,
    })

    // Then
    return expect(
      usecase({
        spotId: 'spot-id',
        body,
      })
    ).rejects.toThrow('Comment body cannot be empty')
  })
})

describe('authentication', () => {
  it('should throw when the user is not logged in', () => {
    // Given
    ;(spotRepository.findById as jest.Mock).mockResolvedValue(getTestSpot())
    authenticationService = new AuthenticationService({
      currentUser: null,
    })

    usecase = addComment({
      spotRepository,
      commentRepository,
      authenticationService,
    })

    // Then
    return expect(
      usecase({ spotId: 'spot-id', body: 'comment body' })
    ).rejects.toThrow('Current user is not logged in')
  })
})

it('should save a new comment', async () => {
  // Given
  ;(spotRepository.findById as jest.Mock).mockResolvedValue(getTestSpot())
  authenticationService = new AuthenticationService({
    currentUser: getTestUser(),
  })

  usecase = addComment({
    spotRepository,
    commentRepository,
    authenticationService,
  })

  // When
  await usecase({ spotId: 'spot-id', body: 'comment body' })

  // Then
  expect(commentRepository.persist).toHaveBeenCalledTimes(1)
  expect(commentRepository.persist).toHaveBeenCalledWith(
    expect.objectContaining({
      id: expect.any(String),
      body: 'comment body',
      spotId: 'spot-id',
      authorId: 'user-id',
      createdAt: expect.any(Date),
    })
  )
})

it('should resolve the new comment', async () => {
  // Given
  ;(spotRepository.findById as jest.Mock).mockResolvedValue(getTestSpot())
  authenticationService = new AuthenticationService({
    currentUser: getTestUser(),
  })

  usecase = addComment({
    spotRepository,
    commentRepository,
    authenticationService,
  })

  // When
  const result = await usecase({ spotId: 'spot-id', body: 'comment body' })

  // Then
  expect(result).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      body: 'comment body',
      spotId: 'spot-id',
      authorId: 'user-id',
      createdAt: expect.any(Date),
    })
  )
})
