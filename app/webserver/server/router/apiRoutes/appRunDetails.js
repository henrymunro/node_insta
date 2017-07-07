// Route point routes
const routeURI = '/appRunDetails'
const {AppRunDetailsModel} = require('./../../../../global_modules/database').models
const {apiRouteCreator} = require('./../../../../global_modules/express-mongo')
const appRoutes = apiRouteCreator(AppRunDetailsModel)

module.exports = function (apiRoute) {
  apiRoute.route(routeURI)
.get((req, res, next) => appRoutes.getEntries(req, res, next, {limit: 1, sort: {createdAt: -1} }))

}
