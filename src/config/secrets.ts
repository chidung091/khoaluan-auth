import * as dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const getEnv = (key: string): string => {
  return process.env[key]
}
export const ENV = process.env.NODE_ENV
export const PORT = process.env.PORT
// JWT
// MySQL
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME

export const MICROSERVICE_HOST = getEnv('MICROSERVICE_HOST')
export const BE1_SERVICE = getEnv('BE1_SERVICES')
