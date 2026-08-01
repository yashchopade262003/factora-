import api from "../api/axios";

const getAllVendors = () => {
    return api.get("/vendor/getAll");
};

const getVendorById = (id) => {
    return api.get(`/vendor/${id}`);
};

const addVendor = (vendor) => {
    return api.post("/vendor/add", vendor);
};

const getVendorInventory = (id) => {
    return api.get(`/vendor/${id}/inventory`);
};

export default {
    getAllVendors,
    getVendorById,
    addVendor,
    getVendorInventory
};