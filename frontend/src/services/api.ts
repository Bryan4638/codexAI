import axios, { AxiosError } from 'axios'

const URL = import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chamba-code-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Return the response data if possible, otherwise the error
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
