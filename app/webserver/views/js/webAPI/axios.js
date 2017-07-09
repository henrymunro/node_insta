import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 5000

})

export const URLs = {
  // none admin
  currentAppInfo: '/app',
  appRunDetails: '/appRunDetails'
}
