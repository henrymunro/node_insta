const { logger, logError } = require('../logger')
const loggerModule = 'apiRouteCreator.js'
const sendStack = true//require('../../config').sendStackTrack

logger.info('Loading in apiRouteCreator', {loggerModule, startUp: true})

module.exports = function apiRoute (Schema) {
/*
* GET /uri route to retrieve all the entries.
*/
  function getEntries (req, res, next, {clause = {endDate: null}, sort = {}, fields = {}, limit, skip} = {}) {
    logger.debug('Request recieved to get entries', {loggerModule, URL: req.originalUrl, clause, sort, fields})
// Query the DB and if no errors, send all the books
    const query = Schema.find(clause).select(fields).sort(sort).limit(limit).skip(skip)
    query.exec((err, output) => {
      if (err) {
        logError(err, `Error getting entries  ${req.originalUrl}`, loggerModule)
        sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'}) // Only send stack in dev
      }
// If no errors, send them back to the client
      res.json(output)
    })
  }

/*
* POST /uri to save a new entry.
*/
  function postEntries (req, res) {
    return new Promise((resolve, reject) => {
      logger.debug('Request recieved to save new entry', {loggerModule, URL: req.originalUrl, value: req.body})
  // Creates a new account
      const newEntry = new Schema(req.body)
  // Save it into the DB.
      newEntry.save((err, entry) => {
        if (err) {
          logError(err, `Error creating entry ${req.originalUrl}`, loggerModule)
          sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'}) // Only send stack in dev
          reject(err)
        } else { // If no errors, send it back to the client
          res.json({ message: 'Entry successfully added!', success: true, entry })
          resolve(entry)
        }
      })
    })
  }
 
/*
* GET /uri/:id route to retrieve an entry given its id.
*/
  function getEntryByID (req, res) {
    logger.debug('Request recieved to get entry by id', { loggerModule, URL: req.originalUrl, id: req.params.id })
    const query = Schema.find({ _id: req.params.id })
    query.exec((err, entry) => {
      if (err) {
        logError(err, `Error getting entry by param ${req.originalUrl}`, loggerModule)
        sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'}) // Only send stack in dev
      }
// If no errors, send it back to the client
      res.json(entry)
    })
  }
/*
* GET /uri/:id route to retrieve an entry given its id.
*/
  const getEntryByParam = (param) => (req, res) => {
    logger.debug('Request recieved to get entry by id', { loggerModule, URL: req.originalUrl, key: param, value: req.params[param] })
    const query = Schema.find({ [param]: req.params[param] })
    query.exec((err, entry) => {
      if (err) {
        logError(err, `Error getting entry by param ${req.originalUrl}`, loggerModule)
        sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'}) // Only send stack in dev
      }
// If no errors, send it back to the client
      res.json(entry)
    })
  }

/*
* DELETE /uri/:id to delete an entry given its id.
*/
  function deleteEntry (req, res) {
    logger.debug('Request recieved to cease entry by id', { loggerModule, URL: req.originalUrl, id: req.params.id })
    _performDatabaseUpdate(req, res, {endDate: new Date()})
  }

/*
* PUT /Account/:id to update an account given its id
*/
  function updateEntry (req, res) {
    logger.debug('Request recieved update entry by id', {loggerModule, URL: req.originalUrl, id: req.params.id})
    _performDatabaseUpdate(req, res, req.body)
  }

  function _performDatabaseUpdate (req, res, update) {
    Schema.findById({_id: req.params.id}, (err, entry) => {
      if (err) {
        logError(err, `Error updating entry by id  ${req.originalUrl}`, loggerModule)
        sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'}) // Only send stack in dev
      }
      Object.assign(entry, update).save((err, entry) => {
        if (err) {
          logError(err, `Error updating entry by id  ${req.originalUrl}`, loggerModule)
          sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'}) // Only send stack in dev
        }
        res.json({ message: 'Entry updated!', success: true, entry })
      })
    })
  }

  function updateMultipleEntries (req, res) {
    logger.debug('Request recieved update multiple entries by id', {loggerModule, URL: req.originalUrl})
    console.log('REQ', req.body)
    _performMultipleDatabaseUpdate(req, res, req.body)
  }

  function _performMultipleDatabaseUpdate (req, res, updates) {
    const updatesPromise = updates.map((update, key) => {
      console.log('UPDATE', update)
      return new Promise((resolve, reject) => {
        Schema.findById({_id: update._id}, (err, entry) => {
          if (err) {
            logError(err, `Error updating entry by id  ${req.originalUrl} id: ${update._id}`, loggerModule)
            sendStack ? reject(err) : reject({error: true, msg: 'An error has occoured'}) // Only send stack in dev
          }
          Object.assign(entry, update).save((err, entry) => {
            if (err) {
              logError(err, `Error updating entry by id  ${req.originalUrl}`, loggerModule)
              sendStack ? reject(err) : reject({error: true, msg: 'An error has occoured'}) // Only send stack in dev
            }
            resolve({ message: 'Entry updated!', success: true, entry })
          })
        })
      })
    })
    Promise.all(updatesPromise).then((result) => {
      res.json({ message: 'Entries updated!', success: true, result })
    }).catch((err) => {
      sendStack ? res.send(err) : res.send({error: true, msg: 'An error has occoured'})
    })
  }

  return {getEntries, postEntries, getEntryByID, getEntryByParam, deleteEntry, updateEntry, updateMultipleEntries}
}

