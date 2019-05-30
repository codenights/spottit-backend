export interface AuthUser {
  sub: string
  email: string
  given_name: string
  family_name: string
  picture?: string
}

export interface AuthCredentials {
  accessToken: string
  refreshToken: string
}

export interface AuthService {
  getAuthorizeUrl(successRedirectUri: string): string
  getCredentials(authorizationCode: string): Promise<AuthCredentials>
  getCurrentUser(accessToken: string): Promise<AuthUser>
  refreshAccessToken(refreshToken: string): Promise<string>
}
