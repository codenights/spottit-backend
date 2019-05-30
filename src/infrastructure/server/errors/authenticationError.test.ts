import { setAuthenticationError } from './authenticationError'

it('should set the HTTP status code to 401', () => {
  // Given
  const ctx: any = {}

  // When
  setAuthenticationError(ctx)

  // Then
  expect(ctx.status).toEqual(401)
})

it('should set the response with a message', () => {
  // Given
  const ctx: any = {}

  // When
  setAuthenticationError(ctx)

  // Then
  expect(ctx.body).toHaveProperty('message')
})
