const schedule = require('node-schedule')
const { logger } = require('../../global_modules/logger')
const moment = require('moment')
const { scrapeHashtags } = require('./../../insta_scrape')
const { morningHour, morningMinute, eveningHour, eveningMinute } = require('../../insta_scrape/config').scrapeScheduler


const _randNumGen = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + 1 + min 
}

const _randTimeGen = () => {
	const seconds = _randNumGen(60, 3600)
  var now = new Date()
	var runDate = new Date(now.getTime() + (1000 * seconds))
	return {runDate, seconds}
}

var morningRule = new schedule.RecurrenceRule()
morningRule.hour = Number(morningHour) || 1
morningRule.minute = Number(morningMinute) || 0

var eveningRule = new schedule.RecurrenceRule()
eveningRule.hour = Number(eveningHour) || 21 
eveningRule.minute = Number(eveningMinute) || 0

 
logger.info('Loading in schedule component', {morning: `${Number(morningHour) || 1}:${Number(morningMinute) || 0}`, evening:`${Number(eveningHour) || 21}:${Number(eveningMinute) || 0}`  })


// Reccuring schedule to run every morning 
const morningSchedule = schedule.scheduleJob(morningRule, function(){
  logger.info('STARTING MORNING SCHEDULE')
  
  // Pick a time to run the scrape in the next hour
	const { runDate, seconds } = _randTimeGen()
  logger.info(`Running scrape in ${seconds} seconds, scheduling job...`)

  schedule.scheduleJob(runDate, function(){
	  logger.info('Starting scrape schedule')
	  const hashtags =  [
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
		scrapeHashtags({hashtags})

	})
})


// Reccuring schedule to run every morning 
const eveningSchedule = schedule.scheduleJob(eveningRule, function(){
  logger.info('STARTING EVENING SCHEDULE')
  
  // Pick a time to run the scrape in the next hour
	const { runDate, seconds } = _randTimeGen()
  logger.info(`Running scrape in ${seconds} seconds, scheduling job...`)

  schedule.scheduleJob(runDate, function(){
	  logger.info('Starting scrape schedule')
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

	})
})
 

