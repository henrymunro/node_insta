'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  SCHEDULER_ENABLED: joi.boolean().required()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false'),
  SCHEDULE_MORNING_HOUR: joi.string(),
  SCHEDULE_MORNING_MINUTE: joi.string(),
  SCHEDULE_EVENING_HOUR: joi.string(),
  SCHEDULE_EVENING_MINUTE: joi.string(),
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  scrapeScheduler:{
    enabled: envVars.SCHEDULER_ENABLED,
    morningHour: envVars.SCHEDULE_MORNING_HOUR,
    morningMinute: envVars.SCHEDULE_MORNING_MINUTE,
    eveningHour: envVars.SCHEDULE_EVENING_HOUR,
    eveningMinute: envVars.SCHEDULE_EVENING_MINUTE
  }
}

module.exports = config
