import * as uuid from 'node-uuid'

import { SpotRepository } from '../../application/repository'
import { Spot } from '../../domain/model'

interface Database {
  [key: string]: Spot
}

const parkRobinson = new Spot(
  uuid.v4(),
  'Parc Robinson',
  'Le skate park d Asnières',
  {
    latitude: 48.909018,
    longitude: 2.2930765,
  }
)
const skateparkCoubevoie = new Spot(
  uuid.v4(),
  'Skatepark de Courbevoie',
  null,
  {
    latitude: 48.9017561,
    longitude: 2.235201,
  }
)
const espaceGlisseParis = new Spot(
  uuid.v4(),
  'Espace Glisse Paris 18',
  'Tres bon skatepark pour apprendre',
  {
    latitude: 48.899555,
    longitude: 2.3630618,
  }
)

const database: Database = {
  [parkRobinson.id]: parkRobinson,
  [skateparkCoubevoie.id]: skateparkCoubevoie,
  [espaceGlisseParis.id]: espaceGlisseParis,
}

const degreesToRadians = (value: number) => (value * Math.PI) / 180

export const SpotInMemory = (): SpotRepository => {
  return {
    persist: spot => {
      database[spot.id] = spot

      return Promise.resolve(spot)
    },
    findByLocation: (latitude, longitude, radius) => {
      const matchingSpots = Object.values(database).filter(({ location }) => {
        const distance =
          Math.acos(
            Math.cos(degreesToRadians(latitude)) *
              Math.cos(degreesToRadians(location.latitude)) *
              Math.cos(
                degreesToRadians(longitude) -
                  degreesToRadians(location.longitude)
              ) +
              Math.sin(degreesToRadians(latitude)) *
                Math.sin(degreesToRadians(location.latitude))
          ) * 6371

        return distance <= radius
      })

      return Promise.resolve(matchingSpots)
    },
  }
}
