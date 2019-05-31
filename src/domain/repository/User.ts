import { User } from '../model'

export interface UserRepository {
  persist: (spot: User) => Promise<User>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  findByUsername: (username: string) => Promise<User | null>
}
