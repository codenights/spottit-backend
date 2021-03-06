import { UserRepository } from '../repository'
import { UserInMemory } from '../../infrastructure/repository/UserInMemory'
import { User } from '../model'

import { createUserAccount, CreateUserAccount } from './create-user-account'
import { UsernameService } from '../services/UsernameService'

let usecase: CreateUserAccount
let userRepository: UserRepository
let usernameService: UsernameService

beforeEach(() => {
  userRepository = UserInMemory()
  usernameService = {
    generateUsername: jest.fn().mockResolvedValue('username'),
  }
  usecase = createUserAccount({ userRepository, usernameService })
})

it('should do nothing when the user already exists', async () => {
  // Given
  const user = new User('user-id', 'john.doe@example.com', 'johndoe')
  await userRepository.persist(user)
  const spy = jest.spyOn(userRepository, 'persist')

  // When
  const result = await usecase({
    email: 'john.doe@example.com',
  })

  // Then
  expect(result).toEqual(user)
  expect(spy).not.toHaveBeenCalled()
})

it('should create the user when it does not exist', async () => {
  // Given
  const email = 'john.doe@example.com'
  const spy = jest.spyOn(userRepository, 'persist')

  // When
  const result = await usecase({ email })

  // Then
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      email: 'john.doe@example.com',
      id: expect.any(String),
      username: expect.any(String),
    })
  )
  expect(result.email).toEqual('john.doe@example.com')
  expect(result.id).toEqual(expect.any(String))
  expect(result.username).toEqual(expect.any(String))
})
