import { User } from '../model'

interface Dependencies {
  currentUser: User | null
}

export class AuthenticationService {
  private currentUser: User | null

  public constructor({ currentUser }: Dependencies) {
    this.currentUser = currentUser
  }

  public isLoggedIn() {
    return Boolean(this.currentUser)
  }

  public getCurrentUser(): User {
    if (!this.currentUser) {
      throw new Error('Current user is not logged in')
    }

    return this.currentUser
  }

  public throwIfNotLoggedIn() {
    this.getCurrentUser()
  }
}
