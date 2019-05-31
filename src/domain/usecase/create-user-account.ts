import * as uuid from 'node-uuid'

import { UserRepository } from '../repository'
import { UsernameService } from '../services/UsernameService'
import { User } from '../model'

interface Dependencies {
  userRepository: UserRepository
  usernameService: UsernameService
}

export type CreateUserAccount = (options: { email: string }) => Promise<User>

export const createUserAccount = ({
  userRepository,
  usernameService,
}: Dependencies): CreateUserAccount => async ({ email }) => {
  const existingUser = await userRepository.findByEmail(email)

  if (existingUser) {
    return existingUser
  }

  const username = await usernameService.generateUsername()
  const user = new User(uuid.v4(), email, username)

  await userRepository.persist(user)

  return user
}
