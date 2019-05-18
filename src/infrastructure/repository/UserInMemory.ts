import { UserRepository } from '../../domain/repository'
import { User } from '../../domain/model'

interface Database {
  [key: string]: User
}

export const UserInMemory = (): UserRepository => {
  const database: Database = {}

  return {
    persist: user => {
      database[user.id] = user

      return Promise.resolve(user)
    },
    findByEmail: email =>
      Promise.resolve(
        Object.values(database).find(user => user.email === email) || null
      ),
  }
}
