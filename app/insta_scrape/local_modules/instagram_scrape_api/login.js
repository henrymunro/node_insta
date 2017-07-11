
/**
 * Module to open instagram home page and perform login
 * @return {[type]} [description]
 */

const config = require('../../config').login
const {logger, logError} = require('../../../global_modules/logger')
const async = require('async')

module.exports = ({driver, By, until}) => () => {

	const _getHomePage = (resolve) => {
		// Open instagram home, this takes you to sign up page
		logger.debug(`Opening Instagram home URL: ${config.urls.home}`)
		return driver.get(config.urls.home)
	}

	const _navigateToExisitingUserLogin = () => {
		// Navigate from the home page (sign up) to existing user login page
		logger.debug('Clicking button to move to exisiting user login')
		driver.findElement(By.className(config.paths.loginExistingUserClass)).click()

		// Wait for login page to load. 
		// TO DO: find specific field to look for, this currently does nothing as there is a username field on the home sign up page
		return driver.wait(until.elementLocated(By.name('username')), 2000)
	}

	const _fillInUsername = () => {
		// Type username
		logger.debug('Inputting username')
		return driver.findElement(By.name('username')).sendKeys(config.credentials.username)
		
	}

	const _fillInPassword = () => {
		// Type password
		logger.debug('Inputting password')
		return driver.findElement(By.name('password')).sendKeys(config.credentials.password)
	}

	const _clickLoginbutton = () => {
		logger.debug('Clicking login button')
		return driver.findElement(By.className(config.paths.loginButtonClass)).click()
	}

	const _checkLoginSuccessful = ()=> {
		return new Promise((resolve, reject)=> {
			logger.debug('Checking to see if login was successful')
			setTimeout(() => {
				driver.findElements(By.className(config.paths.loginSuccessfulClass))
		     		.then(found => {
		     			if(!!found.length) {
		     				logger.info(`User ${config.credentials.username} sucessfully logged in`)
		     				resolve('Login successful')
		     			}
		     			else {
		     				logger.error(`Invalid credentials for user ${config.credentials.username}, login failed`)
		     				reject('Login failed')
		     			}
		     		})
			}, 4000)
		})
	}

	const _performLogin = () => {
		return new Promise((resolveLogin, rejectLogin) => {
			logger.debug('Attempting login')
			_getHomePage()
				.then(_navigateToExisitingUserLogin)
				.then(_fillInUsername)
				.then(_fillInPassword)
				.then(_clickLoginbutton)
				.then(_checkLoginSuccessful)
				.then(() => { return resolveLogin({success: true})})
				.catch(err => {
					logger.error('An error has occoured in the login process', err )
					rejectLogin()
				})
		})
	}



	// Attempt to perform login until successful or max retries
	return new Promise((resolveOuterLogin, rejectOuterLogin) => {
		logger.info('Starting Login Process')
		let retryCount = 1 
		let loginSuccess = false

		// Async loop over login attempts
		async.whilst(
		    function() { return !(loginSuccess || retryCount > 5) },
		    (callback) => {
		        _performLogin()
					.then(({success}) => {
					loginSuccess = success
					return callback(undefined, success)
				}).catch(err => {
					logger.error('Loging attempt failed, retrying', err)
					retryCount++
					// If failed on the final retry return an error
					if (retryCount > 5) {
						return callback('Max loging attempts reached')
					}
					// Else return no error so whilst reruns
					return callback(undefined)
				})
		    },
		    function (err, n) {
		        if (err){
		        	logger.error('Max login retries met, aborting')
		        	return rejectOuterLogin()
		        }
		        logger.debug(`Login attempt ${retryCount} successful`)
		        return resolveOuterLogin()
		    }
		)
	})
	

}

