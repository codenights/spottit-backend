import * as uuid from 'node-uuid'

import { UserRepository } from '../repository'
import { User } from '../model'

interface Dependencies {
  userRepository: UserRepository
}

export type LinkSocialAccount = (options: { email: string }) => Promise<User>

// TODO: rename to create user account
export const linkSocialAccount = ({
  userRepository,
}: Dependencies): LinkSocialAccount => async ({ email }) => {
  const existingUser = await userRepository.findByEmail(email)

  if (existingUser) {
    return existingUser
  }

  const user = new User(uuid.v4(), email)

  await userRepository.persist(user)

  return user
}
