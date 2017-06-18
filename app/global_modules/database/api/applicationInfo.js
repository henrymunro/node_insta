const { logger } = require('../../logger')
const ObjectID = require('bson').ObjectID

const ApplicationInfoModel = require('../models/applicationInfoModel')
const { updateItemInArray, updateObject } = require('../../utils')
const { saveUserLike } = require('./user')


// Used to log the start of a new run of the scraping application
// Returns the ID for future updates
const logNewRun = ({hashtags}) => {
	return new Promise((resolve, reject) => {
		logger.silly('Logging new run to database', hashtags)
		// add _id to each hashtag
		let hashtagsWithID = hashtags.map(elm => Object.assign({}, elm, {_id: new ObjectID()}))
		// Save entry to DB
		const newEntry = new ApplicationInfoModel({hashtags: hashtagsWithID})
		newEntry.save((err, entry) => {
			if (err) {
				logger.error('Error saving new application run details to DB' , {err})
				reject(err)
			} else { 
				logger.silly('New application run details saved to DB', {entry})
				resolve({runID: entry._id})
			}
		})
	})
}


// Saves the details of a new like when searching by hashtag
const saveNewHashtagLike = ({hashtag, imageDetails, runID}) => {
	ApplicationInfoModel.findById({_id: runID}, (err, entry) => {
		if ( err ) { 
			return logger.error('Error saving new hashtag like to DB', err)
		} 
		// Find hashtag in array of hashtags 
		let hashtagID = entry.hashtags.filter(elm => elm.hashtag === hashtag)[0]._id
		// Make sure hashtag exisits then push like to object
		if ( hashtagID ) {
			const nextHashtags = updateItemInArray(entry.hashtags, hashtagID, (item) => {
				// Add the photo to the likes array and increment the inspected count
				const likes = item.likes || []
				let nextLikes = [...likes]
				nextLikes.push(Object.assign({}, imageDetails, {likeTime: new Date()}))
			    return updateObject(item, {likes: nextLikes, inspected: (item.inspected || 0) + 1})
			})
			// Save changes to DB 
			Object.assign(entry, {hashtags: nextHashtags, totalLikes: entry.totalLikes + 1, inspected: entry.inspected + 1}).save((err, entry) => {
				if (err) {
					logger.error('Error saving new hashtag like', err)
				}
				logger.silly('New hashtag like saved to the database')
			})
		}
	})

}

const incrementHashtagInspectCount = ({hashtag, runID}) => {
	logger.silly('Incrementing hashtag count in DB' , {hashtag, runID})
	ApplicationInfoModel.findById({_id: runID}, (err, entry) => {
		if ( err ) { 
			return logger.error('Error saving new hashtag like to DB', err)
		} 
		// Find hashtag in array of hashtags 
		let hashtagID = (entry.hashtags.filter(elm => elm.hashtag === hashtag)[0] || {})._id
		// Make sure hashtag increment running inpected count
		if ( hashtagID ) {
			const nextHashtags = updateItemInArray(entry.hashtags, hashtagID, (item) => {
			    return updateObject(item, {inspected: (item.inspected || 0) + 1})
			})
			Object.assign(entry, {hashtags: nextHashtags, inspected: entry.inspected + 1}).save((err, entry) => {
				if (err) {
					logger.error('Error incrementing hashtag inspection', err)
				}
				logger.silly('New hashtag like saved to the database')
			})
		}
	})
}

const saveUserLikeToApplicationInfo = ({hashtag, username, runID}) => {
	ApplicationInfoModel.findById({_id: runID}, (err, entry) => {
		if ( err ) { 
			return logger.error('Error saving new user like to appliction info DB', err)
		} 
		// Find hashtag in array of hashtags 
		let hashtagID = entry.hashtags.filter(elm => elm.hashtag === hashtag)[0]._id
		// Make sure hashtag exisits then push like to object
		if ( hashtagID ) {
			const nextHashtags = updateItemInArray(entry.hashtags, hashtagID, (item) => {
				// Add the photo to the likes array and increment the inspected count
				const users = item.users || []
				const userDB = users.filter(elm => elm.username === username)[0]
				let nextUsers
				// User already exists in array to update
				if ( userDB ) {
					nextUser = Object.assign({}, userDB, {likes: (userDB.likes || 0) + 1, inspected: (userDB.inspected || 0) + 1})
					// Remove and re-add to array 
					nextUsers = [...users].filter(elm => elm.username !== username)
					nextUsers.push(nextUser)
				} else {
					// User doens't exist in array so add
					nextUsers = [...users]
					nextUsers.push({username, likes: 1, inspected: 1})
				}
			    return updateObject(item, {users: nextUsers, userInspected: (item.userInspected || 0) + 1, userLikes: (item.userLikes || 0) + 1})
			})
			// Save changes to DB 
			Object.assign(entry, {hashtags: nextHashtags, totalLikes: entry.totalLikes + 1, inspected: entry.inspected + 1}).save((err, entry) => {
				if (err) {
					logger.error('Error saving new user like to appilcation info', err)
				}
				logger.silly('New user like saved to application info')
			})
		}
	})
}


const saveUserInspectionToApplicationInfo = ({hashtag, username, runID}) => {
	ApplicationInfoModel.findById({_id: runID}, (err, entry) => {
		if ( err ) { 
			return logger.error('Error saving new user inspection to appliction info DB', err)
		} 
		// Find hashtag in array of hashtags 
		let hashtagID = entry.hashtags.filter(elm => elm.hashtag === hashtag)[0]._id
		// Make sure hashtag exisits then push like to object
		if ( hashtagID ) {
			const nextHashtags = updateItemInArray(entry.hashtags, hashtagID, (item) => {
				// Add the photo to the likes array and increment the inspected count
				const users = item.users || []
				const userDB = users.filter(elm => elm.username === username)[0]
				let nextUsers
				// User already exists in array to update
				if ( userDB ) {
					nextUser = Object.assign({}, userDB, {inspected: (userDB.inspected || 0) + 1})
					// Remove and re-add to array 
					nextUsers = [...users].filter(elm => elm.username !== username)
					nextUsers.push(nextUser)
				} else {
					// User doens't exist in array so add
					nextUsers = [...users]
					nextUsers.push({username, inspected: 1})
				}
			    return updateObject(item, {users: nextUsers, userInspected: (item.userInspected || 0) + 1})
			})
			// Save changes to DB 
			Object.assign(entry, {hashtags: nextHashtags, totalLikes: entry.totalLikes + 1, inspected: entry.inspected + 1}).save((err, entry) => {
				if (err) {
					logger.error('Error saving new user inspection to appaition info', err)
				}
				logger.silly('New user inpections saved to application info')
			})
		}
	})
}

const savePhotoLike = ({type, hashtag, imageDetails, runID, username}) => {
	let usernameSent = (imageDetails || {}).username || username
	if (type === 'hashtag') {
		usernameSent && saveUserLike({hashtag, imageDetails, username: usernameSent})
		return saveNewHashtagLike({hashtag, imageDetails, runID})
	}
	if (type === 'user' && usernameSent) {
		saveUserLike({hashtag, imageDetails, username: usernameSent, runID})
		return saveUserLikeToApplicationInfo({hashtag, username: usernameSent, runID})
	}
}

const incrementImageInspectCount = ({type, hashtag, username, runID}) => {
	if (type === 'hashtag') {
		return incrementHashtagInspectCount({hashtag, runID})
	}
	if (type === 'user') {
		return saveUserInspectionToApplicationInfo({hashtag, username, runID})
	}
}



module.exports = { 
	logNewRun, 
	savePhotoLike, 
	incrementImageInspectCount
}