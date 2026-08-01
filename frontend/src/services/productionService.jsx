import api from "../api/axios";

const getAll = () =>
    api.get("/production/all");

const getById = (id) =>
    api.get(`/production/${id}`);

const add = (data) =>
    api.post("/production/add", data);

const update = (id, data) =>
    api.put(`/production/update/${id}`, data);

const remove = (id) =>
    api.delete(`/production/delete/${id}`);

// =======================
// Search
// =======================

const findByVendor = (vendorId) =>
    api.get(`/production/vendor/${vendorId}`);

const findByStatus = (status) =>
    api.get(`/production/status/${status}`);

// =======================
// Workflow
// =======================

const start = (id) =>
    api.put(`/production/start/${id}`);

const complete = (id, producedQuantity) =>
    api.put(`/production/complete/${id}?producedQuantity=${producedQuantity}`);

const cancel = (id) =>
    api.put(`/production/cancel/${id}`);

export default {
    getAll,
    getById,
    add,
    update,
    remove,

    findByVendor,
    findByStatus,

    start,
    complete,
    cancel
};
