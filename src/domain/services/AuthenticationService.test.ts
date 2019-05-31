import { AuthenticationService } from './AuthenticationService'
import { User } from '../model'

it('isLoggedIn: returns false when the current user is null', () => {
  // Given
  const currentUser = null
  const service = new AuthenticationService({ currentUser })

  // When
  const result = service.isLoggedIn()

  // Then
  expect(result).toEqual(false)
})

it('isLoggedIn: returns true when the current user is defined', () => {
  // Given
  const currentUser = new User('user-id', 'jane.doe@gmail.com', 'janedoe')
  const service = new AuthenticationService({ currentUser })

  // When
  const result = service.isLoggedIn()

  // Then
  expect(result).toEqual(true)
})

it('getCurrentUser: returns the user if defined', () => {
  // Given
  const currentUser = new User('user-id', 'jane.doe@gmail.com', 'janedoe')
  const service = new AuthenticationService({ currentUser })

  // When
  const result = service.getCurrentUser()

  // Then
  expect(result).toEqual(currentUser)
})

it('getCurrentUser: throws an error if the user is not defined', () => {
  // Given
  const currentUser = null
  const service = new AuthenticationService({ currentUser })

  // When
  const fn = (): unknown => service.getCurrentUser()

  // Then
  expect(fn).toThrow(new Error('Current user is not logged in'))
})
