import axios from "axios";

const api = axios.create({
    baseURL: "http://13.212.74.18/api"
});

export default api