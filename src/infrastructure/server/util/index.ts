import { AwilixContainer } from 'awilix'
import Koa from 'koa'
import Joi from '@hapi/joi'

export const getContainerFromKoaContext = (
  ctx: Koa.ParameterizedContext
): AwilixContainer => {
  const container = ctx.state.container

  if (!container) {
    throw new Error('DI container was not found in context.')
  }

  return container
}

export const validateSchemaOrThrow = (
  schema: Joi.ObjectSchema,
  value: any
): void => {
  const error = schema.validate(value).error

  if (error) {
    throw error
  }
}
