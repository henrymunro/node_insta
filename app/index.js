const {logger} = require('./logger')

const { login, quitBrowser } = require('./local_modules/instagram_scrape_api')
const { likePhotosByHashtag, likePhotosByUser } = require('./local_modules/likePhotos')

login()
	.then(() => _likeOnHashtagThenUsers())
	// .then(() => likePhotosByUser({username: 'henrysmunro', probability:0.5, count:10}))
	// .then(() => likePhotosByHashtag({hashtag: 'travel', probability:0.9, count:85}))
	// .then(() => likePhotosByHashtag({hashtag: 'bikeTour', probability:0.85, count:90}))
	// .then(() => quitBrowser())
	.catch(err => {
		console.error(`ERROR: ${err}`)
		quitBrowser()
	})



const _likeOnHashtagThenUsers = () => {
	return likePhotosByHashtag({hashtag: 'travel', probability:0.9, count:5})
		.then(result => { 
			console.log(result)
		})
}