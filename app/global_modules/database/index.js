const api = require('./api')
const models = require('./models')

module.exports = Object.assign({}, {
  databaseApi: api,
  models
})
