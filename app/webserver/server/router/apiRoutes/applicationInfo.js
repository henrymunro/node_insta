// Route point routes
const routeURI = '/app'
const ApplicationInfoModel = require('./../../../../global_modules/database/models/applicationInfoModel')
const {apiRouteCreator} = require('./../../../../global_modules/express-mongo')
const appRoutes = apiRouteCreator(ApplicationInfoModel)

const fields = {startTime: 1, updatedAt:1, totalToLike:1, inspected: 1, totalLikes: 1, _id: 0}

module.exports = function (apiRoute) {
  apiRoute.route(routeURI)
.get((req, res, next) => appRoutes.getEntries(req, res, next, {limit: 1, sort: {startTime: -1}, fields }))

  apiRoute.route(routeURI + '/:id')
.get(appRoutes.getEntryByID)
}
