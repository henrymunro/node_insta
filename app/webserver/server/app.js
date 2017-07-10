const express = require('express')
// const cookieParser = require('cookie-parser')
const rand = require('random-key')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const helmet = require('helmet') // Security Module
const app = express()
const path = require('path')
const schedulerEnabled = require('../../insta_scrape/config').scrapeScheduler.enabled
const { scrapeHashtags } = require('../../insta_scrape')

// Set up logger
const { logger } = require('../../global_modules/logger')

// Pull in Scrape scheduler
if (schedulerEnabled) {
  require('./scheduler')
}


// view engine setup
app.set('views', path.join(__dirname, '/../build'))
// app.use(favicon(path.join(__dirname, '/../build', 'bicycle-icon.png')))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
  keys: [0, 0, 0, 0, 0].map((val) => rand.generate()),
  maxAge: 24 * 60 * 60 * 1000
}))
// Static routing
const staticRouting = express.static(path.join(__dirname, '/../build'))
app.use(staticRouting)

// Pull in HTTP Logging
require('../../global_modules/logger').HTTPRequestLogger(app)

// Loads Routes
require('./router/index')(app)
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/../build/index.html')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  logger.error('404 not found', {module: loggerModule, url: req.url})
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({
      message: err.message,
      error: err,
      stack: err.stack
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({
    message: err.message,
    error: {}
  })
})

module.exports = app
