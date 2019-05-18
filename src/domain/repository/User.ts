import { User } from '../model'

export interface UserRepository {
  persist: (spot: User) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
}
