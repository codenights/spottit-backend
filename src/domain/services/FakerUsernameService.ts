import faker from 'faker'

import { UserRepository } from '../repository'
import { UsernameService } from './UsernameService'

interface Dependencies {
  userRepository: UserRepository
}

export class FakerUsernameService implements UsernameService {
  private userRepository: UserRepository

  public constructor({ userRepository }: Dependencies) {
    this.userRepository = userRepository
  }

  public async generateUsername(): Promise<string> {
    let username: string = ''

    do {
      // FIXME: there is an possible infinite loop when all adjectives and noun combinations
      // are taken. We should fix this issues (maybe using an increment?)
      const tryUsername = `${faker.hacker.adjective()}${faker.hacker.noun()}`
      const existingUser = await this.userRepository.findByUsername(tryUsername)

      if (!existingUser) {
        username = tryUsername
      }
    } while (!username)

    return username.replace(/[^a-z|0-9]/g, '_')
  }
}
