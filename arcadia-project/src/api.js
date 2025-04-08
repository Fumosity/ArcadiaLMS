import axios from "axios"
import changethisip from "./changethisip.json"

export const BASE_URL = changethisip.BASE_URL
export const API_URL = `${BASE_URL}/api`

const api = axios.create({
  baseURL: API_URL,
})

export default api

