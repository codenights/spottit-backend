import { SpotRepository } from '../../application/repository'
import { Spot } from '../../domain/model'

interface Database {
  [key: string]: Spot
}

const parkRobinson = new Spot(
  'spot-1',
  'Parc Robinson',
  'Le skate park d Asnières',
  {
    latitude: 48.909018,
    longitude: 2.2930765,
  }
)
const skateparkCoubevoie = new Spot('spot-2', 'Skatepark de Courbevoie', null, {
  latitude: 48.9017561,
  longitude: 2.235201,
})
const espaceGlisseParis = new Spot(
  'spot-3',
  'Espace Glisse Paris 18',
  'Tres bon skatepark pour apprendre',
  {
    latitude: 48.899555,
    longitude: 2.3630618,
  }
)
const skateparkBourse = new Spot('spot-4', 'Skate Park Léon Cladel', null, {
  latitude: 48.8685633,
  longitude: 2.3417836,
})

const database: Database = {
  [parkRobinson.id]: parkRobinson,
  [skateparkCoubevoie.id]: skateparkCoubevoie,
  [espaceGlisseParis.id]: espaceGlisseParis,
  [skateparkBourse.id]: skateparkBourse,
}

const degreesToRadians = (value: number): number => (value * Math.PI) / 180

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

    findById: id => {
      const spot = database[id] || null

      return Promise.resolve(spot)
    },
  }
}
