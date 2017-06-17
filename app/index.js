const {logger} = require('./logger')
const _ = require("underscore")
const mapLimit = require('async/mapLimit')

const { login, quitBrowser } = require('./local_modules/instagram_scrape_api')
const { likePhotosByHashtag, likePhotosByUser } = require('./local_modules/likePhotos')



const hashtags = [
	{hashtag: 'travel', probability:0.9, count:3, usercount: 2},
	{hashtag: 'bikeTour', probability:0.85, count:2, usercount: 1}
]


login()
	.then(() => _loopOverHashtags(hashtags))
	// .then(() => likePhotosByUser({username: 'henrysmunro', probability:0.5, count:10}))
	// .then(() => likePhotosByHashtag({hashtag: 'travel', probability:0.9, count:85}))
	// .then(() => likePhotosByHashtag({hashtag: 'bikeTour', probability:0.85, count:90}))
	.then(() => quitBrowser())
	.catch(err => {
		console.error(`ERROR: ${err}`)
		quitBrowser()
	})



const _loopOverHashtags = (hashtags) => {
	return new Promise((resolve, reject) => {
		logger.info('Starting loop over hashtags')
		mapLimit(hashtags, 1, (hashtag, callback)=> {
			likePhotosByHashtag(hashtag)
			.then(result => { 
				console.log('RESULT: ', result)
				return _loopOverUsers({usernames: result, count: hashtag.usercount})
			}).then(result => {
				callback(undefined, result)
			}).catch(err => callback(err))
		}, (err, result) => {
			if (err) {
				logger.error('Error looping over hashtags', err)
				reject()
			} else {
				logger.info('Finished looping over hashtags')
				resolve()
			}
		})
	})
}


const _loopOverUsers = ({usernames, count=10}) => {
	return new Promise((resolve, reject) => {
		logger.info(`Starting to loop over ${count} usernames`)
		if (usernames.length > 1){
			let filteredUsername = usernames.filter(elm => (elm||{}).username)
			// Pick random usernames by shuffle then select
			filteredUsername = _.shuffle(filteredUsername)
			preparedUsernames = filteredUsername.slice(0, count)

			// Start to loop over users
			mapLimit(preparedUsernames, 1, (user, callback) => {
				likePhotosByUser({username: user.username, probability:0.5, count:10})
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