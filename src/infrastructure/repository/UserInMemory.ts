import { UserRepository } from '../../domain/repository'
import { User } from '../../domain/model'

interface Database {
  [key: string]: User
}

const user1 = new User('user-id-1', 'richard.doe@gmail.com', 'richarddoe')
const user2 = new User('user-id-2', 'jane.doe@gmail.com', 'janedoe')

export const UserInMemory = (): UserRepository => {
  const database: Database = {
    [user1.id]: user1,
    [user2.id]: user2,
  }

  return {
    persist: user => {
      database[user.id] = user

      return Promise.resolve(user)
    },
    findById: id =>
      Promise.resolve(
        Object.values(database).find(user => user.id === id) || null
      ),
    findByEmail: email =>
      Promise.resolve(
        Object.values(database).find(user => user.email === email) || null
      ),
    findByUsername: username =>
      Promise.resolve(
        Object.values(database).find(user => user.username === username) || null
      ),
  }
}
