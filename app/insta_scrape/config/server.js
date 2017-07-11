'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().required(),
  LOGGER_ENABLED: joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(true),
  LOGGER_LEVEL: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  HEADLESS_CHROME: joi.boolean()
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
  NODE_ENV: envVars.NODE_ENV,
  headlessChrome: envVars.HEADLESS_CHROME,
  logger: {
    level: envVars.LOGGER_LEVEL,
    enabled: envVars.LOGGER_ENABLED
  }
}

module.exports = config
