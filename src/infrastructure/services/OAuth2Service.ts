export interface OAuth2User {
  email: string
}

export interface OAuth2Credentials {
  accessToken: string
  refreshToken: string
}

// TODO: Move the interface to domain/services
export interface OAuth2Service {
  getAuthorizeUrl(successRedirectUri: string): string
  getCredentials(authorizationCode: string): Promise<OAuth2Credentials>
  getCurrentUser(accessToken: string): Promise<OAuth2User>
  refreshAccessToken(refreshToken: string): Promise<string>
}
