// Route point routes
const routeURI = '/run'
const { scrapeHashtags } = require('./../../../../insta_scrape')

const _randNumGen = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + 1 + min 
}

module.exports = function (apiRoute) {
  apiRoute.route(routeURI)
.get((req, res, next) => {
	const hashtags = [
					{
						hashtag: 'travel', 
						probability:0.9, 
						count:_randNumGen(50, 60), 
						userCount: _randNumGen(34, 35), 
						userProbability: 0.5, 
						userPhotoCount: _randNumGen(6, 10)
					}
				]
		scrapeHashtags({hashtags})
		res.redirect('/')
	})

}
