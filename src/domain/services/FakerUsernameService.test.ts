import faker from 'faker'

import { UserRepository } from '../repository'
import { FakerUsernameService } from './FakerUsernameService'

jest.mock('faker')

const getTestUserRepository = (
  overrides: Partial<UserRepository>
): UserRepository => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByUsername: jest.fn(),
  persist: jest.fn(),
  ...overrides,
})

beforeEach(() => {
  ;(faker.hacker.adjective as jest.Mock).mockReturnValue('adjective')
  ;(faker.hacker.noun as jest.Mock).mockReturnValue('noun')
})

it('generateUsername: should return a username', async () => {
  // Given
  const userRepository = getTestUserRepository({
    findByUsername: jest.fn().mockResolvedValue(null),
  })
  const service = new FakerUsernameService({ userRepository })

  // When
  const result = await service.generateUsername()

  //Then
  expect(result).toEqual('adjectivenoun')
})

it('generateUsername: should retry if the generated username is already taken', async () => {
  // Given
  const userRepository = getTestUserRepository({
    findByUsername: jest
      .fn()
      .mockResolvedValueOnce({
        id: 'user-id',
        email: 'user-email',
      })
      .mockResolvedValueOnce(null),
  })
  const service = new FakerUsernameService({ userRepository })

  // When
  const result = await service.generateUsername()

  //Then
  expect(userRepository.findByUsername).toHaveBeenCalledTimes(2)
  expect(result).toEqual('adjectivenoun')
})

it('generateUsername: should replace all non alphanumeric characters by underscores', async () => {
  // Given
  ;(faker.hacker.adjective as jest.Mock).mockReturnValue(
    'toto-09espace $asticot98°éééàà'
  )
  ;(faker.hacker.noun as jest.Mock).mockReturnValue('')
  const userRepository = getTestUserRepository({
    findByUsername: jest
      .fn()
      .mockResolvedValueOnce({
        id: 'user-id',
        email: 'user-email',
      })
      .mockResolvedValueOnce(null),
  })
  const service = new FakerUsernameService({ userRepository })

  // When
  const result = await service.generateUsername()

  //Then
  expect(result).toEqual('toto_09espace__asticot98______')
})
