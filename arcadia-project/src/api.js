import axios from "axios";

const api = axios.create({
    baseURL: "http://52.221.215.220/api"
});

export default api