import api from "../api/axios";

const login = (data) => api.post("/auth/login", data);

const register = (data) => api.post("/user/register", data);

const sendOtp = (data) => api.post("/auth/send-otp", data);

const verifyOtp = (data) => api.post("/auth/verify-otp", data);

const logout = () => {
    localStorage.removeItem("token");
};

export default {
    login,
    register,
    sendOtp,
    verifyOtp,
    logout
};