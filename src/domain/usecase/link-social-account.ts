import * as uuid from 'node-uuid'

import { UserRepository } from '../../application/repository'
import { User } from '../model'

interface Dependencies {
  userRepository: UserRepository
}

export type LinkSocialAccount = (options: {
  email: string
  googleId: string
}) => Promise<User>

export const linkSocialAccount = ({
  userRepository,
}: Dependencies): LinkSocialAccount => async ({ email, googleId }) => {
  const existingUser = await userRepository.findByEmail(email)

  if (existingUser) {
    return existingUser
  }

  const user = new User(uuid.v4(), googleId, email)

  await userRepository.persist(user)

  return user
}
