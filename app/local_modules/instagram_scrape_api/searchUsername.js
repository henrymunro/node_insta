
/**
 * Module to open instagram home page and perform login
 * @return {[type]} [description]
 */

const config = require('../../config').searchPhotos
const {logger, logError} = require('../../logger')

module.exports = ({driver, By, until, Key}) => (search) => {

  const _getUsernameSearch = () => {
    // Open hashtag search page
    logger.debug(`Opening search page for username: ${search}`)
    return driver.get(config.urls.searchUsername + search)
  }

  const _waitForPageLoad = () => {
    // Ensuring the page has loaded before passing on control
    logger.debug('Checking search page has loaded')
    return driver.wait(until.titleMatches(new RegExp(search,"gi")), 1000) 
  }

  return new Promise((resolve, reject) => {
    logger.info(`Starting Username Search For: ${search}`)
    _getUsernameSearch()
      .then(_waitForPageLoad)
      .then(() => {
        logger.info('Username search complete')
        resolve()
      })
      .catch(err => {
        logger.error('An error has occoured in the username search process', err )
        reject()
      })
  })
}

