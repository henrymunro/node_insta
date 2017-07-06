import { createActions } from 'redux-actions'
import * as actions from './actionTypes'
import webAPI from '../webAPI'


const homeActions = createActions({
// Sever API
  [actions.GET_CURRENT_APP_INFO]: () => webAPI.applicationInfo.getCurrentAppInfo()

})

export default Object.assign({}, homeActions)
