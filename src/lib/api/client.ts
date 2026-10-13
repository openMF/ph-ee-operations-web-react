import axios from 'axios'
import { createAuthInterceptors } from './authInterceptors'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

createAuthInterceptors(apiClient)

export default apiClient
