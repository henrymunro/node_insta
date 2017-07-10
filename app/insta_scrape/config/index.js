
require('dotenv').config({})

// Import specific config
const database = require('./database')
const login = require('./login')
const searchPhotos = require('./searchPhotos')
const server = require('./server')
const scrapeScheduler = require('./scrapeScheduler')

module.exports = Object.assign({}, 
	database, 
	login, 
	searchPhotos, 
	server,
	scrapeScheduler
	)
