const apiRoutes = require('express').Router()

// Application Info routes
require('./applicationInfo')(apiRoutes)

// Application Run Details
require('./appRunDetails')(apiRoutes)


module.exports = apiRoutes
