import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://blog-website-production-7c9c.up.railway.app/api",
});

export default axiosInstance;
