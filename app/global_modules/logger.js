const winston = require('winston')
const expressWinston = require('express-winston')
const fs = require('fs')
const logDir = 'logs'
const appName = 'instagram_scraper'
const Promise = require('bluebird')
const config = require('../insta_scrape/config')

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const tsFormat = () => (new Date()).toLocaleTimeString()

// Logging levels
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

const transports = [
  new (require('winston-daily-rotate-file'))({
    filename: `${logDir}/-${appName}-error.${config.NODE_ENV}.log`,
    name: 'error-file',
    timestamp: tsFormat,
    datePattern: 'yyyy-MM-dd',
    prepend: true,
    handleExceptions: config.NODE_ENV !== 'development',
    humanReadableUnhandledException: config.NODE_ENV !== 'development',
    level: 'error'
  }),
  new (require('winston-daily-rotate-file'))({
    filename: `${logDir}/-${appName}.${config.NODE_ENV}.log`,
    name: 'info-file',
    timestamp: tsFormat,
    datePattern: 'yyyy-MM-dd',
    prepend: true,
    level: config.logger.level
  }),
  new (winston.transports.Console)({
      timestamp: tsFormat,
      filter: [(level, msg, meta) => { return msg }],
      colorize: true,
      level: config.logger.level
    })
]


// Set up standard application logging
const logger = new (winston.Logger)({
  transports: transports
})

Promise.onPossiblyUnhandledRejection(function (error) {
  logger.error('Promise unhandeled rejection', {loggerModule: 'logger', error: error})
  throw error
})

function logError (err, errMsg, ...other) {
  const { message, stack } = err
  logger.error(errMsg, {other, error: message, stack: stack})
}


module.exports = {
  logger,
  logError
}