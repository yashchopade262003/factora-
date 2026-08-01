import api from "../api/axios";
import { isVendorScoped, getSessionVendorId } from "../utils/vendorScope";

// There is no single /dashboard endpoint in the backend. Instead we pull
// each stat from the service that actually owns it and combine them here.
// Each call is caught individually so that one service being unreachable
// (e.g. inventory-service down) doesn't blank out the whole dashboard.
//
// VENDOR / STORE_MANAGER users only ever get their own factory's numbers -
// vendor/user platform totals don't apply to them, and inventory/production/
// dispatch/buyer-order all switch to their vendor-scoped endpoint.
const getDashboardData = async () => {

    const safe = async (promise, fallback) => {
        try {
            const res = await promise;
            return res;
        } catch (error) {
            console.warn("Dashboard widget failed to load:", error);
            return fallback;
        }
    };

    const scoped = isVendorScoped();
    const vendorId = getSessionVendorId();

    if (scoped && vendorId) {
        const [inventory, production, dispatch, orders] = await Promise.all([
            safe(api.get(`/inventory/vendor/${vendorId}`), { data: { data: [] } }),
            safe(api.get(`/production/vendor/${vendorId}`), { data: { data: [] } }),
            safe(api.get(`/dispatch/vendor/${vendorId}`), { data: { data: [] } }),
            safe(api.get(`/buyer-order/vendor/${vendorId}`), { data: { data: [] } })
        ]);

        const items = inventory.data?.data || [];
        const productionOrders = production.data?.data || [];
        const dispatchOrders = dispatch.data?.data || [];
        const buyerOrders = orders.data?.data || [];

        return {
            isVendorScoped: true,
            totalMaterials: items.length,
            lowStockMaterials: items.filter(i => i.status === "LOW_STOCK").length,
            outOfStockMaterials: items.filter(i => i.status === "OUT_OF_STOCK").length,
            productionInProgress: productionOrders.filter(o => o.status === "IN_PROGRESS").length,
            dispatchPending: dispatchOrders.filter(d => d.deliveryStatus === "PENDING" || d.deliveryStatus === "IN_TRANSIT").length,
            openBuyerOrders: buyerOrders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length
        };
    }

    const [vendors, users, inventory, production, dispatch, buyerOrders] = await Promise.all([
        safe(api.get("/vendor/getAll"), { data: [] }),
        safe(api.get("/user/list"), { data: [] }),
        safe(api.get("/inventory/dashboard"), { data: { data: null } }),
        safe(api.get("/production/all"), { data: { data: [] } }),
        safe(api.get("/dispatch/all"), { data: { data: [] } }),
        safe(api.get("/buyer-order/all"), { data: { data: [] } })
    ]);

    const inventoryStats = inventory.data?.data || null;
    const productionOrders = production.data?.data || [];
    const dispatchOrders = dispatch.data?.data || [];
    const orders = buyerOrders.data?.data || [];

    return {
        isVendorScoped: false,
        vendorCount: Array.isArray(vendors.data) ? vendors.data.length : 0,
        userCount: Array.isArray(users.data) ? users.data.length : 0,
        totalMaterials: inventoryStats?.totalMaterials ?? 0,
        lowStockMaterials: inventoryStats?.lowStockMaterials ?? 0,
        outOfStockMaterials: inventoryStats?.outOfStockMaterials ?? 0,
        inventoryValue: inventoryStats?.inventoryValue ?? 0,
        productionInProgress: productionOrders.filter(o => o.status === "IN_PROGRESS").length,
        dispatchPending: dispatchOrders.filter(d => d.deliveryStatus === "PENDING" || d.deliveryStatus === "IN_TRANSIT").length,
        openBuyerOrders: orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length
    };
};

export default {
    getDashboardData
};
