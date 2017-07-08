import { api, URLs } from '../axios'

export const getCurrentAppInfo = () => api.get(URLs.currentAppInfo)

export const getPreviousAppInfo = ({skip}) => api.get(`${URLs.currentAppInfo}/skip/${Number(skip)}`)