import axios from "axios"
import config from "./config.json"

export const BASE_URL = config.BASE_URL
export const API_URL = `${BASE_URL}`

const api = axios.create({
  baseURL: API_URL,
})

export default api
