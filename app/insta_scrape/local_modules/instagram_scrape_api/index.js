
console.log('Loading in webdriver')
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    promise = webdriver.promise,
    until = webdriver.until
    Key = webdriver.Key;

const chrome = require('selenium-webdriver/chrome')
const options = new chrome.Options()
options.setUserPreferences( { credentials_enable_service: false } )
options.addArguments("--headless")

const driver = new webdriver.Builder().
		setChromeOptions(options).
        withCapabilities(webdriver.Capabilities.chrome()).
        build()

const driverBundle = {driver, By, until, Key, promise}


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

