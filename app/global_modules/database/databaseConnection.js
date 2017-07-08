const mongoose = require('mongoose')
const { logger, logError } = require('../logger')
const loggerModule = 'databaseConnection.js'
const config = require('../../insta_scrape/config').database
const env = require('../../insta_scrape/config').NODE_ENV

logger.info('Loading in databaseConnection', {loggerModule, startUp: true})

// const connectionURL = config.URL// + '/' + config.database
// const connectionURL = "mongodb://henrymunro-shard-00-00-lqexw.mongodb.net:27017,henrymunro-shard-00-01-lqexw.mongodb.net:27017,henrymunro-shard-00-02-lqexw.mongodb.net:27017"

let connectionURL
if (env === 'development') {
  connectionURL = `mongodb://${config.URL}/${config.database}`
} else {
  connectionURL = `mongodb://${config.username}:${config.password}@${config.URL}/${config.database}?${config.URL_params}`
}

mongoose.connect(connectionURL)
// mongoose.connect("mongodb://HenryAdmin:Ly3w3nqG5O0QL1ps@henrymunro-shard-00-00-lqexw.mongodb.net:27017,henrymunro-shard-00-01-lqexw.mongodb.net:27017,henrymunro-shard-00-02-lqexw.mongodb.net:27017/admin?ssl=true&replicaSet=HenryMunro-shard-0&authSource=admin")
mongoose.Promise = global.Promise

console.log(connectionURL)
// Test connection to DB
const db = mongoose.connection

// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {
  logger.info(`Mongoose default connection open to ${config.URL}`, {loggerModule, connectionURL, type: 'database'})
})

// If the connection throws an error
db.on('error', (err) => {
  logError(err, 'Error connecting to database', loggerModule)
  // throw new Error(err)
})

// When the connection is disconnected
db.on('disconnected', function () {
  logger.error('Mongoose default connection disconnected', {loggerModule, type: 'database'})
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  db.close(function () {
    logger.info('Mongoose default connection disconnected through app termination', {loggerModule, type: 'database'})
    process.exit(0)
  })
})

module.exports = {
  mongoose: mongoose
}

