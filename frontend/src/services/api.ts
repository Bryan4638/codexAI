import { useAuthStore } from '@/store/useAuthStore'
import axios, { type AxiosError } from 'axios'

const URL = import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chamba-code-access-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 Unauthorized for expired tokens
    if (error.response?.status === 401 && !originalRequest._retry) {
      useAuthStore.getState().resetAuth()
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('chamba-code-refresh-token')

      if (!refreshToken) {
        isRefreshing = false
        // If there's no refresh token, just clear and reject
        localStorage.removeItem('chamba-code-access-token')
        return Promise.reject(error.response?.data || error)
      }

      try {
        const { data } = await axios.post(`${URL}/auth/refresh`, {
          refreshToken,
        })

        const newAccessToken = data?.accessToken || data?.token
        if (newAccessToken) {
          localStorage.setItem('chamba-code-access-token', newAccessToken)

          if (data.refreshToken) {
            localStorage.setItem('chamba-code-refresh-token', data.refreshToken)
          }

          api.defaults.headers.common['Authorization'] =
            `Bearer ${newAccessToken}`
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken)
          return api(originalRequest)
        } else {
          throw new Error('No access token in refresh response')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('chamba-code-access-token')
        localStorage.removeItem('chamba-code-refresh-token')
        // We do not redirect automatically here to allow the UI logic/useAuthStore to handle it gracefully
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Return the response data if possible, otherwise the error
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
