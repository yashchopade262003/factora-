import api from "../api/axios";

const getAll = () =>
    api.get("/inventory/all");

const getById = (id) =>
    api.get(`/inventory/${id}`);

const add = (data) =>
    api.post("/inventory/add", data);

const update = (id, data) =>
    api.put(`/inventory/update/${id}`, data);

const remove = (id) =>
    api.delete(`/inventory/delete/${id}`);

const deleteAll = () =>
    api.delete("/inventory/delete-all");

// =======================
// Search
// =======================

const findByMaterialCode = (code) =>
    api.get(`/inventory/material/${code}`);

const findByMaterialName = (name) =>
    api.get(`/inventory/material-name/${name}`);

const findByBatch = (batch) =>
    api.get(`/inventory/batch/${batch}`);

const findByStatus = (status) =>
    api.get(`/inventory/status/${status}`);

const findByVendor = (vendorId) =>
    api.get(`/inventory/vendor/${vendorId}`);

const findBySupplier = (supplierId) =>
    api.get(`/inventory/supplier/${supplierId}`);

const findByCategory = (category) =>
    api.get(`/inventory/category/${category}`);

const findByWarehouse = (location) =>
    api.get(`/inventory/warehouse/${location}`);

const findByWarehouseId = (warehouseId) =>
    api.get(`/inventory/warehouse/id/${warehouseId}`);

// =======================
// Reports
// =======================

const available = () =>
    api.get("/inventory/available");

const lowStock = () =>
    api.get("/inventory/low-stock");

const outOfStock = () =>
    api.get("/inventory/out-of-stock");

const dashboard = () =>
    api.get("/inventory/dashboard");

const count = () =>
    api.get("/inventory/count");

const totalValue = () =>
    api.get("/inventory/value");

// =======================
// Stock
// =======================

const stockIn = (id, quantity) =>
    api.put(`/inventory/stock-in/${id}?quantity=${quantity}`);

const stockOut = (id, quantity) =>
    api.put(`/inventory/stock-out/${id}?quantity=${quantity}`);

const adjustStock = (id, quantity) =>
    api.put(`/inventory/adjust-stock/${id}?quantity=${quantity}`);

// =======================
// Pagination
// =======================

const page = (pageNo = 0, size = 10) =>
    api.get(`/inventory/page?page=${pageNo}&size=${size}`);

export default {
    getAll,
    getById,
    add,
    update,
    remove,
    deleteAll,

    findByMaterialCode,
    findByMaterialName,
    findByBatch,
    findByStatus,
    findByVendor,
    findBySupplier,
    findByCategory,
    findByWarehouse,
    findByWarehouseId,

    available,
    lowStock,
    outOfStock,

    dashboard,
    count,
    totalValue,

    stockIn,
    stockOut,
    adjustStock,

    page
};