import { api, URLs } from '../axios'

export const getCurrentAppInfo = () => api.get(URLs.currentAppInfo)
