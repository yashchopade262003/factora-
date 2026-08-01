import api from "../api/axios";

const getAllUsers = () => {
    return api.get("/user/list");
};

const getUserById = (id) => {
    return api.get(`/user/${id}`);
};

const updateUser = (id, user) => {
    return api.put(`/user/update/${id}`, user);
};

const deleteUser = (id) => {
    return api.delete(`/user/delete/${id}`);
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
