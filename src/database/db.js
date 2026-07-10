import knex from 'knex'
import knexConfig from '../../knexfile.js'

const environment = process.env.NODE_ENV || 'development'
const config = knexConfig[environment]

if (!config) {
  throw new Error(`Database configuration for environment "${environment}" not found in knexfile.js`)
}

const db = knex(config)

export default db
