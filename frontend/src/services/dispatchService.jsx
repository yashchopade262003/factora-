import api from "../api/axios";

const getAll = () =>
    api.get("/dispatch/all");

const getById = (id) =>
    api.get(`/dispatch/${id}`);

const add = (data) =>
    api.post("/dispatch/add", data);

const update = (id, data) =>
    api.put(`/dispatch/update/${id}`, data);

const remove = (id) =>
    api.delete(`/dispatch/delete/${id}`);

// =======================
// Search
// =======================

const findByVendor = (vendorId) =>
    api.get(`/dispatch/vendor/${vendorId}`);

const findByBuyer = (buyerId) =>
    api.get(`/dispatch/buyer/${buyerId}`);

const findByStatus = (status) =>
    api.get(`/dispatch/status/${status}`);

// =======================
// Workflow
// =======================

const markInTransit = (id) =>
    api.put(`/dispatch/in-transit/${id}`);

const markDelivered = (id) =>
    api.put(`/dispatch/delivered/${id}`);

const cancel = (id) =>
    api.put(`/dispatch/cancel/${id}`);

export default {
    getAll,
    getById,
    add,
    update,
    remove,

    findByVendor,
    findByBuyer,
    findByStatus,

    markInTransit,
    markDelivered,
    cancel
};
