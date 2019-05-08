import Joi from '@hapi/joi'

import { validateSchemaOrThrow } from '.'

describe('validateSchemaOrThrow', () => {
  it('should not throw when the object matches the schema', () => {
    expect.assertions(1)

    // Given
    const schema = Joi.object({
      id: Joi.string().required(),
    }).required()

    const object = {
      id: 'some-id',
    }

    // Then
    expect(() => validateSchemaOrThrow(schema, object)).not.toThrow()
  })

  it('should throw an error when the object does not match the schema', () => {
    expect.assertions(1)

    // Given
    const schema = Joi.object({
      id: Joi.string().required(),
    }).required()

    const object = {
      iddd: 'some-id',
    }

    // Then
    expect(() => validateSchemaOrThrow(schema, object)).toThrow()
  })
})
