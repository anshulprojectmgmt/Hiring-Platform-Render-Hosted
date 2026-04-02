import axios from "axios";
import BASE_URL from "../../Api";
const API = axios.create({
  baseURL: `${BASE_URL}/api/auth` || "https://api.realtyai.in/api/auth",
});

export const signup = async (data) => {
  return API.post("/signup", data);
};

export const verifyOtp = async (data) => {
  return API.post("/verify-otp", data);
};

export const login = async (data) => {
  return API.post("/login", data);
};
