import Koa from 'koa'

export function setAuthenticationError(ctx: Koa.Context): void {
  ctx.status = 401
  ctx.body = {
    message: 'Could not authenticate request.',
  }
}
