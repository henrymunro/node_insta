'use strict'
const joi = require('joi')

const envVarsSchema = joi.object({
  ENABLE_HASHTAG_LIKE: joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(true),
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}



const config = {
	searchPhotos: {
		enableLike: envVars.ENABLE_HASHTAG_LIKE,
		urls: {
			searchHashtag: 'https://www.instagram.com/explore/tags/',
			searchUsername: 'https://www.instagram.com/',
		},
		paths: {
			mostRecentPhotoClass: '_8mlbc',
			photoModalClass: '_n3cp9',
			imageHasBeenLikedClass: 'coreSpriteLikeHeartFull',
			likeImageClass: '_tk4ba',
			nextPhotoArrowClass: 'coreSpriteRightPaginationArrow'
		},
		userInfoClass: {			
			username: '_4zhc5',
			date: '_9gcwa',
			image: '_icyx7'

		}
	}
}

module.exports = config
