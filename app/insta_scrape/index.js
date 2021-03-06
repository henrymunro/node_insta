const { scrapeHashtags } = require('./local_modules/top_level_scrape')

const _randNumGen = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + 1 + min 
}

const hashtags = [
	{
		hashtag: 'travel', 
		probability:0.9, 
		count:_randNumGen(50, 60), 
		userCount: _randNumGen(34, 35), 
		userProbability: 0.5, 
		userPhotoCount: _randNumGen(6, 10)
	},
	{
		hashtag: 'bikeTour', 
		probability:0.85, 
		count:_randNumGen(20, 30), 
		userCount: _randNumGen(15, 17), 
		userProbability: 0.5, 
		userPhotoCount: _randNumGen(6, 10)
	},
	{
		hashtag: 'bikeTouring', 
		probability:0.85, 
		count:_randNumGen(20, 30), 
		userCount: _randNumGen(15, 17), 
		userProbability: 0.5, 
		userPhotoCount: _randNumGen(6, 10)
	},
	{
		hashtag: 'nature', 
		probability:0.8, 
		count:_randNumGen(30, 50), 
		userCount: _randNumGen(17, 20), 
		userProbability: 0.5, 
		userPhotoCount: _randNumGen(6, 10)
	},	
	{
		hashtag: 'sunset', 
		probability:0.8, 
		count:_randNumGen(30, 50), 
		userCount: _randNumGen(8, 15), 
		userProbability: 0.5, 
		userPhotoCount: _randNumGen(6, 10)
	}
]

if(process.env.SCRAPE === 'true') {
	scrapeHashtags({hashtags})
}


module.exports = {
	scrapeHashtags
}