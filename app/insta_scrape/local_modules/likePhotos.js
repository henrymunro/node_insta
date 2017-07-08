const {logger} = require('../../global_modules/logger')
const mapLimit = require('async/mapLimit')

const { searchHashtag, searchUsername, inspectSearchPhotos } = require('./instagram_scrape_api')
const { openFirstImage, checkIfImageIsLiked, likeImage, moveToTheNextImage } = inspectSearchPhotos

const { databaseApi } = require('../../global_modules/database')

const _likePhoto = () => {
		return checkIfImageIsLiked()
			.then(liked => {
				if(!liked){
					 return likeImage()
				}
			}).catch(err => {
				throw new Error(err)
			})
	}

const _likePhotos = ({count, probability, type, hashtag, runID, username}) => {	

	const _proccessLike = callback => {
		logger.debug('Random criteria met, starting process to like photo')
		let imageDetails
		// Likes photo which also returns the image details 
		return _likePhoto().then((imageDetailsReturned) => {
			// pulls out image details then moves to next image
			imageDetails = imageDetailsReturned
			databaseApi.applicationInfo.savePhotoLike({runID, imageDetails, username, hashtag, type})
			return moveToTheNextImage()
		}).then(({nextPhotoArrowDoesNotExist}) => {
			// stores image details and return bool value stating 
			// if there is another image to process after
			callback(undefined, imageDetails)
			return nextPhotoArrowDoesNotExist
		}).catch(err => callback(err))
	}

	const _moveToNextImageWithoutLike = callback => {
		logger.info('NO DICE!')
		databaseApi.applicationInfo.incrementImageInspectCount({type, hashtag, username, runID})
		return moveToTheNextImage()
			.then(({nextPhotoArrowDoesNotExist}) => {
				callback()
				// return bool of if there is another image to process after
				return nextPhotoArrowDoesNotExist
			})
			.catch(err => callback(err))
	}

	// Starts and async loop and inspects each photo in turn 
	// It first rolls the dice then if the random number is correct 
	// it then checks to see if the photo has been liked 
	// if not it likes is 
	// then moves on to next photo
	return new Promise((resolve, reject) => {
		logger.debug(`Starting to inspect ${count} photos`)
		const photos = Array.apply(null, {length: count}).map(Number.call, Number)

		// Async loop over each photo to inspect in turn
		let nextPhotoDoesNotExist = false
		mapLimit(photos, 1, (i, callback) => {	
			// If the next photo does not exist just run to the end of the loop
			if (nextPhotoDoesNotExist) {
				logger.info(`Reached end of the photos ${i}`)
				callback()
			} else {
				// If the next photo does exist inspect it
				logger.info(`Inspecting photo ${i}`)
				if (_rollDice(probability)){
					_proccessLike(callback)
						.then(nextPhotoArrowDoesNotExist => nextPhotoDoesNotExist = nextPhotoArrowDoesNotExist)
				} else { 
					_moveToNextImageWithoutLike(callback)
						.then(nextPhotoArrowDoesNotExist => nextPhotoDoesNotExist = nextPhotoArrowDoesNotExist)
				}
			}

		}, (err, results) => {
			if (err) {
				logger.error('Error looping over photos', {err})
				reject(err)
			} else { 
				logger.info('Finsihed looping over photos')
				resolve(results)
			}
		})			
	})
}

const _rollDice = (probability) => {
	const rand = Math.floor(Math.random() * 100) + 1   
	return rand <= probability * 100
}



const likePhotosByHashtag = ({hashtag, probability=0.8, count=50, runID}) => {
	return new Promise((resolveHashtagSearch, rejectHashtagSearch) => {
		logger.info('Starting to like by hashtag' , {hashtag, probability, count})
		searchHashtag(hashtag)	
			.then(() => openFirstImage(9))		
			.then(() => _likePhotos({count, probability, runID, hashtag, type: 'hashtag'}))
			.then(result => resolveHashtagSearch(result))
			.catch(err => {
				logger.error(`Error liking by hashtag: ${err}`)
				rejectHashtagSearch(err)
			})
		
	})
}

const likePhotosByUser = ({username, probability=0.5, count=10, runID, hashtag}) => {
	return new Promise((resolveUsernameSearch, rejectUsernameSearch) => {
		logger.info('Starting to like by username' , {username, probability, count})
		searchUsername(username)	
			.then(() => openFirstImage())		
			.then(({userHasNoImages}) => {
				// Check to make sure user has uploaded photos before trying to like
				if (userHasNoImages) {
					logger.info('User has no images therefore skipping')
					return {}
				} else {
					return _likePhotos({count, probability, username, runID, hashtag, type: 'user'})
				}
			})
			.then(result => resolveUsernameSearch(result))
			.catch(err => {
				logger.error(`Error liking by username: ${err}`)
				rejectUsernameSearch(err)
			})
	})
}


module.exports = {
	likePhotosByHashtag,
	likePhotosByUser
}

