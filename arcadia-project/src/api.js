import axios from "axios";

const api = axios.create({
    baseURL: "http://13.229.180.191/api"
});

export default api