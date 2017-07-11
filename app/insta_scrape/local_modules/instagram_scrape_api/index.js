const {logger} = require('../../../global_modules/logger')
const {headlessChrome} = require('../../config')

try {
    logger.info('Loading in webdriver')
    var webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        promise = webdriver.promise,
        until = webdriver.until
        Key = webdriver.Key;

    var chrome = require('selenium-webdriver/chrome')
    var options = new chrome.Options()
    options.setUserPreferences( { credentials_enable_service: false } )
    

    if (headlessChrome) {
        logger.info('Setting chrome headless')
        options.addArguments("--headless")
    }

    var driver = new webdriver.Builder().
    		setChromeOptions(options).
            withCapabilities(webdriver.Capabilities.chrome()).
            build()

    var driverBundle = {driver, By, until, Key, promise}
} catch (err) {
    logger.error(`Error loading in webdriver: ${err}`)
    throw new Error(err)
}


// Load in modules
const login = require('./login')(driverBundle)
const searchHashtag = require('./searchHashtag')(driverBundle)
const searchUsername = require('./searchUsername')(driverBundle)
const inspectSearchPhotos = require('./inspectSearchPhotos')(driverBundle)

const quitBrowser = () => {
    driver.quit()
}


module.exports = { 
	login, 
	searchHashtag, 
    searchUsername,
	inspectSearchPhotos,
    quitBrowser
}

