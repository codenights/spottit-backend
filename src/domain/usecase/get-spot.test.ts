import { SpotRepository } from '../repository'
import { GetSpot, getSpot } from './get-spot'
import { Spot } from '../model'

let usecase: GetSpot
let spotRepository: SpotRepository

beforeEach(() => {
  spotRepository = {
    persist: jest.fn(),
    findByLocation: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
  }
  usecase = getSpot({ spotRepository })
})

it('should throw an error when the spot is not found', () => {
  expect.assertions(1)
  ;(spotRepository.findById as jest.Mock).mockResolvedValue(null)

  return expect(usecase({ id: 'spot-id' })).rejects.toEqual(
    new Error('Spot spot-id was not found')
  )
})

it('should resolve the spot', async () => {
  const spot = new Spot('spot-id', 'spot name', null, {
    latitude: 0,
    longitude: 0,
  })
  ;(spotRepository.findById as jest.Mock).mockResolvedValue(spot)

  const result = await usecase({ id: 'spot-id' })

  expect(result).toEqual(spot)
})
