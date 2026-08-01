import api from "../api/axios";

// =======================
// Buyers
// =======================

const getAll = () =>
    api.get("/buyer/all");

const getById = (id) =>
    api.get(`/buyer/${id}`);

const add = (data) =>
    api.post("/buyer/add", data);

const update = (id, data) =>
    api.put(`/buyer/update/${id}`, data);

const remove = (id) =>
    api.delete(`/buyer/delete/${id}`);

const findByVendor = (vendorId) =>
    api.get(`/buyer/vendor/${vendorId}`);

// =======================
// Buyer Orders
// =======================

const getAllOrders = () =>
    api.get("/buyer-order/all");

const getOrderById = (id) =>
    api.get(`/buyer-order/${id}`);

const addOrder = (data) =>
    api.post("/buyer-order/add", data);

const updateOrder = (id, data) =>
    api.put(`/buyer-order/update/${id}`, data);

const removeOrder = (id) =>
    api.delete(`/buyer-order/delete/${id}`);

const findOrdersByVendor = (vendorId) =>
    api.get(`/buyer-order/vendor/${vendorId}`);

const findOrdersByBuyer = (buyerId) =>
    api.get(`/buyer-order/buyer/${buyerId}`);

const findOrdersByStatus = (status) =>
    api.get(`/buyer-order/status/${status}`);

const updateOrderStatus = (id, status) =>
    api.put(`/buyer-order/status/${id}?status=${status}`);

export default {
    getAll,
    getById,
    add,
    update,
    remove,
    findByVendor,

    getAllOrders,
    getOrderById,
    addOrder,
    updateOrder,
    removeOrder,
    findOrdersByVendor,
    findOrdersByBuyer,
    findOrdersByStatus,
    updateOrderStatus
};
