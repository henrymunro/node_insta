const apiRoutes = require('express').Router()

// Application Info routes
require('./applicationInfo')(apiRoutes)


module.exports = apiRoutes
