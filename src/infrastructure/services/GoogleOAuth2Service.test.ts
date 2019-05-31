import axios from 'axios'

import { castToJestMock } from '../../test-utils'
import { GoogleOAuth2Service } from './GoogleOAuth2Service'

jest.mock('axios')

let service: GoogleOAuth2Service

beforeEach(() => {
  service = new GoogleOAuth2Service({
    googleClientId: 'client-id',
    googleClientSecret: 'client-secret',
    googleRedirectUri: 'redirect-uri',
  })
})

describe('getAuthorizeUrl', () => {
  it('should return the correct URL', () => {
    // Given
    const successRedirectUri = 'http://example.com'

    // When
    const authorizeUrl = service.getAuthorizeUrl(successRedirectUri)

    // Then
    expect(authorizeUrl).toEqual(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=client-id&redirect_uri=redirect-uri&state=http%3A%2F%2Fexample.com&include_granted_scopes=true&access_type=offline&response_type=code&scope=profile%20email&prompt=consent'
    )
  })
})

describe('getCredentials', () => {
  beforeEach(() => {
    castToJestMock(axios.post).mockResolvedValue({
      data: {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      },
    })
  })

  it('should call the correct URL', async () => {
    // Given
    const authorizationCode = 'authorization-code'

    // When
    await service.getCredentials(authorizationCode)

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(
      'https://www.googleapis.com/oauth2/v4/token',
      {
        client_id: 'client-id',
        client_secret: 'client-secret',
        code: 'authorization-code',
        grant_type: 'authorization_code',
        redirect_uri: 'redirect-uri',
      }
    )
  })

  it('should return the credentials', async () => {
    // Given
    const authorizationCode = 'authorization-code'

    // When
    const result = await service.getCredentials(authorizationCode)

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })
  })
})

describe('getCurrentUser', () => {
  beforeEach(() => {
    castToJestMock(axios.get).mockResolvedValue({
      data: 'user-info',
    })
  })

  it('should call the correct URL', async () => {
    // Given
    const accessToken = 'access-token'

    // When
    await service.getCurrentUser(accessToken)

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer access-token' } }
    )
  })

  it('should return the user', async () => {
    // Given
    const accessToken = 'access-token'

    // When
    const result = await service.getCurrentUser(accessToken)

    expect(result).toEqual('user-info')
  })
})
