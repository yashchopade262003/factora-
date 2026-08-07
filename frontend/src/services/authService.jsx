import api from "../api/axios";

const login = (data) => api.post("/auth/login", data);

const register = (data) => api.post("/user/register", data);

const sendOtp = (data) => api.post("/auth/send-otp", data);

const verifyOtp = (data) => api.post("/auth/verify-otp", data);

// ---------------------------------------------------------------------------
// Session helpers
//
// The backend's verify-otp response isn't guaranteed to be a flat object.
// Two things in particular vary between backends / can change over time:
//   1. The payload may be wrapped, e.g. { success, message, data: {...} }
//   2. `role` may come back as a plain string ("ADMIN"), a prefixed string
//      ("ROLE_ADMIN"), or a nested Role entity ({ roleId, roleName, ... })
//      since Role is a related JPA entity, not a column on User.
//
// If we don't normalize this, `localStorage.setItem("role", data.role)`
// can end up storing the literal string "[object Object]", which then
// fails to match any key in menuConfig -> sidebar renders no options.
// ---------------------------------------------------------------------------

const unwrap = (response) => {
    const raw = response?.data ?? {};
    // Support both a flat payload and a { data: {...} } wrapper.
    if (raw.data && typeof raw.data === "object") {
        return raw.data;
    }
    return raw;
};

const normalizeRole = (role) => {
    if (!role) return "";

    if (typeof role === "object") {
        role = role.roleName || role.role_name || role.name || role.role || "";
    }

    return String(role).trim().toUpperCase().replace(/^ROLE_/, "");
};

const isEmptyValue = (value) =>
    value === undefined ||
    value === null ||
    value === "" ||
    value === "undefined" ||
    value === "null";

/**
 * Normalizes and persists the session from a verify-otp (or login) response.
 * Returns the normalized payload so callers can use it right away
 * (e.g. to decide where to redirect) without re-reading localStorage.
 */
const saveSession = (response) => {
    const payload = unwrap(response);

    const token = payload.token || payload.accessToken || payload.jwt || "";
    const role = normalizeRole(payload.role);

    if (isEmptyValue(token)) {
        // Don't silently store a broken session - throw so the caller's
        // catch block can show a real error instead of navigating to a
        // dashboard that will immediately 401 and bounce back to /login.
        throw new Error("Login response did not include an auth token.");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userId", payload.userId ?? payload.user_id ?? "");
    localStorage.setItem("username", payload.username ?? "");
    localStorage.setItem("email", payload.email ?? "");
    localStorage.setItem("role", role);
    localStorage.setItem("vendorId", payload.vendorId ?? payload.vendor_id ?? "");

    return { token, role, ...payload };
};

const isAuthenticated = () => !isEmptyValue(localStorage.getItem("token"));

const getRole = () => localStorage.getItem("role") || "";

const logout = () => {
    localStorage.clear();
};

export default {
    login,
    register,
    sendOtp,
    verifyOtp,
    saveSession,
    isAuthenticated,
    getRole,
    logout
};
