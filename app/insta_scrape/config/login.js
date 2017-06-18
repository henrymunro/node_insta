'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  INSTA_USERNAME: joi.string().required(),
  INSTA_PASSWORD: joi.string().required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  login: {
    credentials: {
      username: envVars.INSTA_USERNAME,
      password: envVars.INSTA_PASSWORD,
    }, 
    urls: {
      home: 'https://www.instagram.com',
    },
    paths: {
      loginExistingUserClass: '_fcn8k',
      loginButtonClass: '_ah57t',
      loginSuccessfulClass: 'logged-in'
    }
  }
}

module.exports = config
