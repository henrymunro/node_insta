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

// Set up HTTP logging
function HTTPRequestLogger (app) {
  // Set up file logging
  app.use(expressWinston.logger({
    transports: [
      new (require('winston-daily-rotate-file'))({
        filename: `${logDir}/-${appName}-HTTP.${config.NODE_ENV}.log`,
        name: 'HTTP-file',
        timestamp: tsFormat,
        datePattern: 'yyyy-MM-dd',
        prepend: true
      })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    ignoreRoute: function (req, res) { return false } // optional: allows to skip some log messages based on request and/or response
  }))

  // Set up console logging when not testing
  if (config.NODE_ENV !== 'test' && config.NODE_ENV !== 'test_production') {
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: false,
          colorize: true
        })
      ],
      meta: false, // optional: control whether you want to log the meta data about the request (default to true)
      msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) { return false } // optional: allows to skip some log messages based on request and/or response
    }))
  }
}


module.exports = {
  logger,
  logError,
  HTTPRequestLogger
}