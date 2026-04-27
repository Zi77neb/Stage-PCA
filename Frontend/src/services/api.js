import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const login = async (username, password) => {
  const res = await API.post("/auth/login", { username, password });
  return res.data;
};

export default API;