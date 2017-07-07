import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { reducer as appStatus } from '../appStatus'
import { reducer as newAppRun } from '../newAppRun'

export default combineReducers({
  appStatus,
  newAppRun,
  routing: routerReducer
})
