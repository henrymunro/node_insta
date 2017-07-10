import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { updateObject } from '../reducers/reducerUtilities'

const initialState = {
  currentAppInfo: {},
  skip: 1,
  stopPoll: false
}

const homeReducer = handleActions({
  GET_CURRENT_APP_INFO_FULFILLED: (state, action) => updateObject(state, { currentAppInfo: action.payload.data[0] }),
  GET_PREVIOUS_APP_INFO_FULFILLED: (state, action) => updateObject(state, { currentAppInfo: action.payload.data[0], stopPoll: true }),
  UPDATE_APP_STATUS_PROP: (state, action) => updateObject(state, action.payload)
}, initialState)

export default homeReducer



/*  #############       Selectors     ################   */
export const getCurrentAppInfo = state => (state.appStatus.currentAppInfo)
export const getStartTime = state => (state.appStatus.currentAppInfo.startTime)
export const getCurrentPercentageDone = state => (((state.appStatus.currentAppInfo.inspected || 0) * 100.0 / (state.appStatus.currentAppInfo.totalToLike || 1)) || 0 )
export const getApplicationRunError = state => ((state.appStatus.currentAppInfo || {}).error)
export const getApplicationRunDone = state => ((state.appStatus.currentAppInfo || {}).done)

export const getSkip = state => (state.appStatus.skip)
export const getStopPoll = state => (state.appStatus.stopPoll)