import axios from "axios";

const api = axios.create({
    baseURL: "http://54.255.177.72/api"
});

export default api