import axios from "axios"

export const BASE_URL = "https://arcadialib.site"
//export const BASE_URL = "http://localhost:8000"
export const API_URL = `${BASE_URL}/api`
//export const API_URL = `${BASE_URL}`
const api = axios.create({
  baseURL: API_URL,
})

export default api

