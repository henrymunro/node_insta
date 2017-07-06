import { applyMiddleware, createStore, compose } from 'redux'

import logger from 'redux-logger'
import thunk from 'redux-thunk'
import createDebounce from 'redux-debounce'
import promise from 'redux-promise-middleware'

import reducer from './reducers'

const config = {
  simple: 300
}

const debouncer = createDebounce(config)

const middleware = applyMiddleware(promise(), debouncer, thunk, logger) 

export default createStore(reducer, middleware)
