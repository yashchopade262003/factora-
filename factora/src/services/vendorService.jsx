import api from "../api/axios";

const getAllVendors = () => {
    return api.get("/vendor/getAll");
};

const getVendorById = (id) => {
    return api.get(`/vendor/${id}`);
};

const addVendor = (vendor) => {
    return api.post("/dashboard/vendor/add", vendor);
};

export default {
    getAllVendors,
    getVendorById,
    addVendor
};