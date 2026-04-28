import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const login = async (email, password) => {
  const res = await API.post("/auth/login", {
    email,
    password
  });

  return res.data;
};

export default API;