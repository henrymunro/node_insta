import { createActions } from 'redux-actions'
import * as actions from './actionTypes'
import webAPI from '../webAPI'


const newAppRunActions = createActions({
// Sever API
  [actions.GET_APP_RUN_DETAILS]: () => webAPI.newAppRun.getAppRunDetails()

})

export default Object.assign({}, newAppRunActions)
