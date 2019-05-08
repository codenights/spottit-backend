import { User } from '../../domain/model'

export interface UserRepository {
  persist: (spot: User) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
}
