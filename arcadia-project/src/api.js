import axios from "axios";

const api = axios.create({
    baseURL: "http://13.212.24.184/api"
});

export default api