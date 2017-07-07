import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { updateObject } from '../reducers/reducerUtilities'

const initialState = {
  appRunDetails: {}
}

const appRunDetailsReducer = handleActions({
  GET_APP_RUN_DETAILS_FULFILLED: (state, action) => updateObject(state, { appRunDetails: action.payload.data[0] }),
}, initialState)

export default appRunDetailsReducer



/*  #############       Selectors     ################   */
