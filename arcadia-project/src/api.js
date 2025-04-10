import axios from "axios"

export const BASE_URL = "https://arcadialms.online"
export const API_URL = `${BASE_URL}/api`

const api = axios.create({
  baseURL: API_URL,
})

export default api

