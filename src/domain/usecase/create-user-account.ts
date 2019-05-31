import * as uuid from 'node-uuid'

import { UserRepository } from '../repository'
import { User } from '../model'

interface Dependencies {
  userRepository: UserRepository
}

export type CreateUserAccount = (options: { email: string }) => Promise<User>

export const createUserAccount = ({
  userRepository,
}: Dependencies): CreateUserAccount => async ({ email }) => {
  const existingUser = await userRepository.findByEmail(email)

  if (existingUser) {
    return existingUser
  }

  const user = new User(uuid.v4(), email)

  await userRepository.persist(user)

  return user
}
