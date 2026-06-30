import api from "../api/axios";

const addRole = (role) => {
    return api.post("/role/add", role);
};

const getAllRoles = () => {
    return api.get("/role/list");
};

export default {
    addRole,
    getAllRoles
};