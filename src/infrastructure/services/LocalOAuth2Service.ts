import qs from 'querystring'

import { OAuth2Credentials, OAuth2Service, OAuth2User } from './OAuth2Service'

export class LocalOAuth2Service implements OAuth2Service {
  public getAuthorizeUrl(successRedirectUri: string): string {
    return `/oauth2/callback/?${qs.stringify({
      code: 'authorization_code',
      state: successRedirectUri,
    })}`
  }

  public getCredentials(): Promise<OAuth2Credentials> {
    return Promise.resolve({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    })
  }

  public getCurrentUser(): Promise<OAuth2User> {
    return Promise.resolve({
      email: 'johndoe@gmail.com',
    })
  }

  public refreshAccessToken(): Promise<string> {
    return Promise.resolve('access_token')
  }
}
