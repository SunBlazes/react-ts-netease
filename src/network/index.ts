import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.resolve(false);
  }
);

export default axios;
