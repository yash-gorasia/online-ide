import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/auth",
});



export const googleAuth = (code) => api.get(`/google?code=${code}`);