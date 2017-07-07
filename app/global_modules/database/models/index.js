const applicationInfoModel = require('./applicationInfoModel')
const appRunDetailsModel = require('./appRunDetailsModel')
const userModel = require('./userModel')


module.exports = Object.assign({}, {
  ApplicationInfoModel: applicationInfoModel,
  AppRunDetailsModel: appRunDetailsModel,
  UserModel: userModel,
})
