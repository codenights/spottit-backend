import { UserRepository } from '../repository'
import { UserInMemory } from '../../infrastructure/repository/UserInMemory'
import { User } from '../model'

import { linkSocialAccount, LinkSocialAccount } from './link-social-account'

let usecase: LinkSocialAccount
let userRepository: UserRepository

beforeEach(() => {
  userRepository = UserInMemory()
  usecase = linkSocialAccount({ userRepository })
})

it('should do nothing when the user already exists', async () => {
  // Given
  const user = new User('user-id', 'google-id', 'john.doe@example.com')
  await userRepository.persist(user)
  const spy = jest.spyOn(userRepository, 'persist')

  // When
  const result = await usecase({
    email: 'john.doe@example.com',
    googleId: 'google-id',
  })

  // Then
  expect(result).toEqual(user)
  expect(spy).not.toHaveBeenCalled()
})

it('should create the user when it does not exist', async () => {
  // Given
  const email = 'john.doe@example.com'
  const googleId = 'google-id'
  const spy = jest.spyOn(userRepository, 'persist')

  // When
  const result = await usecase({ email, googleId })

  // Then
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      email: 'john.doe@example.com',
      googleId: 'google-id',
      id: expect.any(String),
    })
  )
  expect(result.email).toEqual('john.doe@example.com')
  expect(result.googleId).toEqual('google-id')
  expect(result.id).toEqual(expect.any(String))
})
