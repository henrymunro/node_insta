import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { reducer as appStatus } from '../appStatus'

export default combineReducers({
  appStatus,
  routing: routerReducer
})
