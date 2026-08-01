import axios from "axios";
import { sanitizePayload } from "../utils/sanitizePayload";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token && token !== "undefined" && token !== "null") {

            config.headers.Authorization = `Bearer ${token}`;

        }

        // Forms keep optional numeric/date fields as "" until filled in.
        // Sending "" for a field the backend expects as Long/LocalDate
        // (e.g. buyerOrderId, finishedGoodsInventoryId, machineId,
        // startDate...) causes a hard JSON deserialization failure on the
        // server ("Malformed request body"). Stripping those down to null
        // here - for every request, on every page - fixes it app-wide.
        if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
            config.data = sanitizePayload(config.data);
        }

        return config;

    },

    (error) => Promise.reject(error)

);

// Centralized response handling: on an expired/invalid token, clear the
// session and bounce back to login instead of leaving the UI stuck showing
// stale data or a raw network error.
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response && error.response.status === 401) {
            console.error("401 Error - session expired or invalid, logging out.");
            console.error("URL:", error.config.url);

            const onLoginPage = window.location.pathname === "/login";
            localStorage.clear();

            if (!onLoginPage) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }

);

export default api;