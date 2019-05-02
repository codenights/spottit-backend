export const validateLatitude = (value: number) => {
  if (value <= -90 || value >= 90) {
    throw new Error(`The latitude must be in ]-90, 90[ (received ${value}).`)
  }
}

export const validateLongitude = (value: number) => {
  if (value <= -180 || value >= 180) {
    throw new Error(`The longitude must be in ]-180, 180[ (received ${value}).`)
  }
}
