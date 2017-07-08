import { createActions } from 'redux-actions'
import * as actions from './actionTypes'
import webAPI from '../webAPI'


const homeActions = createActions({
// Sever API
  [actions.GET_CURRENT_APP_INFO]: () => webAPI.applicationInfo.getCurrentAppInfo(),
  [actions.GET_PREVIOUS_APP_INFO]: (skip) => webAPI.applicationInfo.getPreviousAppInfo({skip}),

},
	actions.UPDATE_APP_STATUS_PROP
)

export default Object.assign({}, homeActions)
