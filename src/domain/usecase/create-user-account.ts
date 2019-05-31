import * as uuid from 'node-uuid'
import faker from 'faker'

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

  let username: string = ''

  do {
    const tryUsername = `${faker.hacker.adjective()}${faker.hacker.noun()}`
    const existingUser = await userRepository.findByUsername(tryUsername)

    if (!existingUser) {
      username = tryUsername
    }
  } while (!username)

  const user = new User(uuid.v4(), email, username)

  await userRepository.persist(user)

  return user
}
