
require('dotenv').config({})

// Import specific config
const login = require('./login')
const searchPhotos = require('./searchPhotos')
const server = require('./server')

module.exports = Object.assign({}, login, searchPhotos, server)
