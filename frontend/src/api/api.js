import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

API.interceptors.response.use(r => r, async err => {
  const orig = err.config
  if (err.response?.status === 401 && !orig._retry) {
    orig._retry = true
    const rf = localStorage.getItem('refresh_token')
    if (rf) {
      try {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${rf}` }
        })
        localStorage.setItem('token', res.data.access_token)
        orig.headers.Authorization = `Bearer ${res.data.access_token}`
        return API(orig)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
  }
  return Promise.reject(err)
})

export default API
