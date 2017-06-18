const { scrapeHashtags } = require('./local_modules/top_level_scrape')

const hashtags = [
	// {hashtag: 'travel', probability:0.9, count:69, userCount: 19, userProbability: 0.5, userPhotoCount: 9},
	// {hashtag: 'bikeTour', probability:0.85, count:23, usercount: 5, userProbability: 0.5, userPhotoCount: 9},
	{hashtag: 'nature', probability:0.8, count:46, usercount: 9, userProbability: 0.5, userPhotoCount: 9}
]


scrapeHashtags({hashtags})