import axios from "axios"

export const BASE_URL = "http://47.129.165.21"
export const API_URL = `${BASE_URL}/api`

const api = axios.create({
  baseURL: API_URL,
})

export default api

