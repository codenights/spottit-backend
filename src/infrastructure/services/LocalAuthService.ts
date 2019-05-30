import qs from 'querystring'

import { AuthCredentials, AuthUser, AuthService } from './AuthService'

export class LocalAuthService implements AuthService {
  public getAuthorizeUrl(successRedirectUri: string): string {
    return `/oauth2/google/?${qs.stringify({
      code: 'authorization_code',
      state: successRedirectUri,
    })}`
  }

  public getCredentials(): Promise<AuthCredentials> {
    return Promise.resolve({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    })
  }

  public getCurrentUser(): Promise<AuthUser> {
    return Promise.resolve({
      sub: 'userid',
      email: 'johndoe@gmail.com',
      given_name: 'John',
      family_name: 'Doe',
    })
  }

  public refreshAccessToken(): Promise<string> {
    return Promise.resolve('access_token')
  }
}
