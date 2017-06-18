const { logger } = require('../../logger')

const UserModel = require('../models/userModel')

const _addNewUser = ({username}) => {
	return new Promise((resolve, reject) => {
		// Check to see if user already exists
		logger.silly('Checking to see if user already exists in the db')
		UserModel.find({username}, (err, entry) => {
			if ( err ) { 
				return logger.error('Error getting user by username', err)
			} 
			// If user does not exist create new user
			else if (entry.length === 0){ 
				logger.silly(`Creating new user entry in DB: ${username}`)
				const newEntry = new UserModel({username})
				newEntry.save((err, entry) => {
					if (err) {
						logger.error('Error saving new user to DB' , {err})
						reject(err)
					} else { 
						logger.silly('New user details saved to DB', {entry})
						resolve()
					}
				})
			} else {
				// User already exists in DB
				resolve()
			}
		})
	})
}

const _saveLikesOfThemAutomationDetails = ({username, runID, hashtag}) => {
	return new Promise((resolve, reject) => {
		logger.silly('Checking to see if the automation details need to be logged against the user in the DB', {username, runID})
		UserModel.find({username}, (err, entry) => {
			if ( err ) { 
				logger.error('Error getting user by username', err)
				reject(err)
			} else { 
				// Check to see if the automation run has already been logged to the database
				const {likesOfThemAutomationDetails} = entry[0]
				const alreadyLogged = likesOfThemAutomationDetails.filter(elm => elm.runID = runID)[0]

				// If not already logged then add the details to the array
				if (!alreadyLogged) {
					let nextLikesOfThem = likesOfThemAutomationDetails
					nextLikesOfThem.push({runID, datetime: new Date(), hashtag})
					Object.assign(entry[0], {likesOfThemAutomationDetail: nextLikesOfThem}).save((err, entry) => {
						if (err) {
							logger.error('Error saving likesOfThemAutomationDetail to user in DB', err)
							reject(err)
						}
						resolve()
					})
				} else { 
					resolve()
				}
			}
		})
	})
}

const _saveLikeToUser = ({username, imageDetails}) => {
	return new Promise((resolve, reject) => {
		logger.silly('Saving new like to user in DB')
		UserModel.find({username}, (err, entry) => {
			if ( err ) { 
				logger.error('Error getting user by username', err)
				reject(err)
			} else { 
				const { likesOfThem } = entry[0]
				let nextLikesOfThem = [...likesOfThem]
				nextLikesOfThem.push(imageDetails)
				// Save changes to DB 
				Object.assign(entry[0], {likesOfThem: nextLikesOfThem}).save((err, entry) => {
					if (err) {
						logger.error('Error saving new like to user', err)
						reject(err)
					}
					logger.silly('New like saved to user')
					resolve()
				})

			}
		})
	})
}


const saveUserLike = ({username, imageDetails, runID, hashtag}) => {
	// Check to see if new user exists
	_addNewUser({username}).then(() => {
		return _saveLikeToUser({username, imageDetails})
	}).then(() => {
		runID && _saveLikesOfThemAutomationDetails({username, runID, hashtag}) 
	}).catch(err => {
		logger.error('Error saving like to user', err)
	})
}


module.exports = { 
	saveUserLike
}