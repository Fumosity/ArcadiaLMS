import axios from "axios"

export const BASE_URL = "http://47.128.154.197"
export const API_URL = `${BASE_URL}/api`

const api = axios.create({
  baseURL: API_URL,
})

export default api

