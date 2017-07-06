import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { updateObject } from '../reducers/reducerUtilities'

const initialState = {
  currentAppInfo: {}
}

const homeReducer = handleActions({
  GET_CURRENT_APP_INFO_FULFILLED: (state, action) => updateObject(state, { currentAppInfo: action.payload.data[0] }),
}, initialState)

export default homeReducer



/*  #############       Selectors     ################   */
export const getCurrentAppInfo = state => (state.home.currentAppInfo)
export const getStartTime = state => (state.home.currentAppInfo.startTime)
export const getCurrentPercentageDone = state => (((state.home.currentAppInfo.inspected || 0) * 100.0 / (state.home.currentAppInfo.totalToLike || 1)) || 0 )