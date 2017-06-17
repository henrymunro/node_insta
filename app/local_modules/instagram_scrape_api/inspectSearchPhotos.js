
/**
 * Module to open instagram home page and perform login
 * @return {[type]} [description]
 */

const config = require('../../config').searchPhotos
const {logger, logError} = require('../../logger')

module.exports = ({driver, By, until, promise}) => {

	const openFirstImage = (startingAtImage) => {
		// Check the user has uploaded photos
		return _checkElementExists(config.paths.mostRecentPhotoClass)
			.then(exist => {
				if (!exist) {
					// If no photos found then return without performing any further actions
					return {userHasNoImages: true}
				} else {
					// Opens the first image in the most recent section
					logger.debug('Opening the first image in the most recent section')
					driver.findElements(By.className(config.paths.mostRecentPhotoClass))
						.then(images => {
							// Picking the 9th image skips all the top images
							// Pick the highest if the 9th has not loaded
							const maxImage = images.length >= (startingAtImage || 0) ? (startingAtImage || 0) : images.length - 1  
							logger.silly(`Opening image number ${maxImage}`)
							images[maxImage].click()
						})
					return driver.wait(until.elementLocated(By.className(config.paths.photoModalClass)), 5000)
				}

			})

	}

	const _getImageInfo = () => {

		const _getFieldInfo = (field) => {
			// Pulls back the specific field based on class
			return new Promise((resolve, reject) => {
				logger.silly(`Getting ${field}`)
				_checkElementExists(config.userInfoClass[field]).then(exist => {
					if (exist){
						driver.findElement(By.className(config.userInfoClass[field])).getText()
							.then(output => {
								logger.silly(`Got ${field}: ${output}`)
								resolve({[field]: output})
							}).catch(reject)
					} else {
						//Couldn't find username just ignore
						resolve()
					}
				})
			})
		}

		const _getDate = () => {
			// Pulls back the date the image was submitted
			return new Promise((resolve, reject) => {
				logger.silly('Getting date')
				_checkElementExists(config.userInfoClass.date).then(exist => {
					if (exist){
						driver.findElement(By.className(config.userInfoClass.date)).getAttribute('datetime')
							.then(output => {
								logger.silly(`Got date: ${output}`)
								resolve({date: new Date(output)})
							}).catch(reject)
					} else {
						//Couldn't find date just ignore
						resolve()
					}
				})
			})
		}

		const _getImage = () => {
			// Pulls back the url of the image
			return new Promise((resolve, reject) => {
				logger.silly('Getting image url')
				_checkElementExists(config.userInfoClass.image).then(exist => {
					if (exist){
						driver.findElement(By.className(config.userInfoClass.image)).getAttribute('src')
							.then(output => {
								logger.silly(`Got image url: ${output}`)
								resolve({url: output})
							}).catch(reject)
					} else {
						//Couldn't find image just ignore
						resolve()
					}
				})
			})
		}


		// Pulls back the image info to be stored
		return new Promise((resolve, reject) => {
			// Loops over each field required
			const imageInfoPromises = ['username'].map(elm => _getFieldInfo(elm))

			Promise.all([...imageInfoPromises, _getDate(), _getImage()]).then(imageInfo => {
				logger.silly('Got image info', imageInfo)
				resolve(imageInfo)
			}).catch(err => reject(err))
		})
	}

	const checkIfImageIsLiked = () => {
		// Check to see if the image has already been liked
		return _checkElementExists(config.paths.imageHasBeenLikedClass)		
	}	

	const likeImage = () => {
		// Likes the image
		logger.info(config.enableLike ? 'Liking image!' : 'Dummy liking image')
		config.enableLike && driver.findElement(By.className(config.paths.likeImageClass)).click()

		// Pull back the image info for the db
		logger.silly('Pulling back image info')
		return _getImageInfo()
	}

	const moveToTheNextImage = () => {
		return new Promise((resolve, reject) => {
			// Presses the arrow to move to the next image after waiting some random time between 2 and 5 seconds
			const randomTime = Math.floor(Math.random() * 3000) + 2501 
			logger.debug('Moving to next image')
			logger.info(`Waiting ${randomTime}ms`)

			let nextPhotoArrowDoesNotExist = false
			_checkElementExists(config.paths.nextPhotoArrowClass)
				.then(exists => {
					nextPhotoArrowDoesNotExist = !exists
					if (exists) {
						return driver.findElement(By.className(config.paths.nextPhotoArrowClass)).click()
					} 
				})
			setTimeout(() => {
				resolve({nextPhotoArrowDoesNotExist})
			}, randomTime)
		})
	}

	const _checkElementExists = (className) => {
		// Check to see element exists on the page
		return new Promise((resolve, reject) => {
			logger.silly(`Checking to see if element ${className} exists on page`)
			driver.findElements(By.className(className))
			     		.then(found => {
			     			if(!found.length) {
			     				logger.silly(`Element ${className} DOES NOT exist`)
			     				resolve(false)
			     			}
			     			else {
			     				logger.silly(`Element ${className} DOES exist`)
			     				resolve(true)
			     			}
			     		}).catch(err => reject(err))
		
		})
	} 

	return {
		openFirstImage,
		checkIfImageIsLiked,
		likeImage,
		moveToTheNextImage
	}

}

