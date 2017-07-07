import { api, URLs } from '../axios'

export const getAppRunDetails = () => api.get(URLs.appRunDetails)
