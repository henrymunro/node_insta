
/**
 * Module to open instagram home page and perform login
 * @return {[type]} [description]
 */

const config = require('../../config').searchPhotos
const {logger, logError} = require('../../../global_modules/logger')

module.exports = ({driver, By, until, Key}) => (search) => {

  const _getHashtagSearch = () => {
    // Open hashtag search page
    logger.debug(`Opening search page for hashtag: ${search}`)
    return driver.get(config.urls.searchHashtag + search)
  }

  const _waitForPageLoad = () => {
    // Ensuring the page has loaded before passing on control
    logger.debug('Checking search page has loaded')
    return driver.wait(until.titleMatches(new RegExp(search,"gi")), 1000) 
  }

  return new Promise((resolve, reject) => {
    logger.info(`Starting Hashtag Search For: ${search}`)
    _getHashtagSearch()
      .then(_waitForPageLoad)
      .then(() => {
        logger.info('Hashtag search complete')
        resolve()
      })
      .catch(err => {
        logger.error('An error has occoured in the search process', err )
        reject()
      })
  })
}

