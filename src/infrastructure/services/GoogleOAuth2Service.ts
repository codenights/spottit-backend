import qs from 'querystring'
import axios from 'axios'

import { OAuth2Credentials, OAuth2User, OAuth2Service } from './OAuth2Service'

interface Dependencies {
  googleClientId: string
  googleClientSecret: string
  googleRedirectUri: string
}

interface GoogleTokenResponse {
  access_token: string
  refresh_token: string
}

interface GoogleRefreshTokenResponse {
  access_token: string
}

const OAUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const API_V3_ENDPOINT = 'https://www.googleapis.com/oauth2/v3'
const API_V4_ENDPOINT = 'https://www.googleapis.com/oauth2/v4'

export class GoogleOAuth2Service implements OAuth2Service {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  public constructor({
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
  }: Dependencies) {
    this.clientId = googleClientId
    this.clientSecret = googleClientSecret
    this.redirectUri = googleRedirectUri
  }

  public getAuthorizeUrl(successRedirectUri: string): string {
    return `${OAUTH_ENDPOINT}?${qs.stringify({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: successRedirectUri,
      include_granted_scopes: true,
      access_type: 'offline',
      response_type: 'code',
      scope: 'profile email',
      prompt: 'consent',
    })}`
  }

  public getCredentials(authorizationCode: string): Promise<OAuth2Credentials> {
    return axios
      .post<GoogleTokenResponse>(`${API_V4_ENDPOINT}/token`, {
        code: authorizationCode,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      })
      .then(response => response.data)
      .then(data => ({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }))
  }

  public getCurrentUser(accessToken: string): Promise<OAuth2User> {
    return axios
      .get<OAuth2User>(`${API_V3_ENDPOINT}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => response.data)
  }

  public refreshAccessToken(refreshToken: string): Promise<string> {
    return axios
      .post<GoogleRefreshTokenResponse>(`${API_V4_ENDPOINT}/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      })
      .then(response => response.data.access_token)
  }
}
