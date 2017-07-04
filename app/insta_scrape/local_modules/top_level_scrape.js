const {logger} = require('../../global_modules/logger')
const _ = require("underscore")
const mapLimit = require('async/mapLimit')


const { databaseApi } = require('../../global_modules/database')


const scrapeHashtags = ({hashtags}) => {
	// Pull in new browser instance
	const { login, quitBrowser } = require('./instagram_scrape_api')
	const { likePhotosByHashtag, likePhotosByUser } = require('./likePhotos')

	let runID
	// Log running attempt to DB
	databaseApi.applicationInfo.logNewRun({hashtags})
		.then(dbReturn => {
			runID = dbReturn.runID
			// run scraping
			return login()
				.then(() => _loopOverHashtags({hashtags}))
				.then(() => quitBrowser())
				.catch(err => {
					logger.error('Error runing scrape', err)
					quitBrowser()
					throw new Error(err)
				})			
		}).catch(err => {
			logger.error('Error runing scrape', err)
			databaseApi.applicationInfo.logError({runID})
			quitBrowser()
			throw new Error(err)
		})

	const _loopOverHashtags = ({hashtags}) => {
		return new Promise((resolve, reject) => {
			logger.info('Starting loop over hashtags')
			mapLimit(_.shuffle(hashtags), 1, (hashtag, callback)=> {
				likePhotosByHashtag(Object.assign({} , hashtag, {runID}))
				.then(result => { 
					const {userCount, userProbability, userPhotoCount } = hashtag
					return _loopOverUsers({usernames: result, count: userCount, hashtag: hashtag.hashtag, userProbability, userPhotoCount})
				}).then(result => {
					callback(undefined, result)
				}).catch(err => callback(err))
			}, (err, result) => {
				if (err) {
					logger.error('Error looping over hashtags', err)
					reject()
				} else {
					logger.info('Finished looping over hashtags')
					databaseApi.applicationInfo.logRunComplete({runID})
					resolve()
				}
			})
		})
	}


	const _loopOverUsers = ({usernames, count=10, hashtag, userProbability=0.5, userPhotoCount=8}) => {
		return new Promise((resolve, reject) => {
			logger.info(`Starting to loop over ${count} usernames`)
			if (usernames.length > 1){
				let filteredUsername = usernames.filter(elm => (elm||{}).username)
				// Pick random usernames by shuffle then select
				filteredUsername = _.shuffle(filteredUsername)
				preparedUsernames = filteredUsername.slice(0, count)

				// Start to loop over users
				mapLimit(preparedUsernames, 1, (user, callback) => {
					likePhotosByUser({username: user.username, probability:userProbability, count:userPhotoCount, runID, hashtag})
						.then(result => callback(undefined, result))
						.catch(err => callback(err))
				}, (err, result) => {
					if (err) {
						logger.error('Error looping over users', err)
						reject(err)
					}
					// If successful pass result back and continue hashtag loop
					logger.info('Finshed username loop')
					resolve(result)
				})
			}	
		})
	}



}





module.exports = { 
	scrapeHashtags
}