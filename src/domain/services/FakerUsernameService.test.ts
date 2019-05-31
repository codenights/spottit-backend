import { UserRepository } from '../repository'
import { FakerUsernameService } from './FakerUsernameService'

const getTestUserRepository = (
  overrides: Partial<UserRepository>
): UserRepository => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByUsername: jest.fn(),
  persist: jest.fn(),
  ...overrides,
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
  expect(result).toEqual(expect.any(String))
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
  expect(result).toEqual(expect.any(String))
})
