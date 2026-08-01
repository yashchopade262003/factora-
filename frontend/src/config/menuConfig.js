// Full, role-based navigation. ADMIN and SUPER_ADMIN intentionally share the
// same menu — a super-admin should never see fewer options than an admin.
const adminMenu = [

    {
        title: "🏠 Dashboard",
        path: "/dashboard"
    },

    {
        group: "MASTER"
    },

    {
        title: "🏭 Vendors",
        path: "/dashboard/vendor/list"
    },

    {
        title: "👤 Users",
        path: "/dashboard/user/list"
    },

    {
        title: "🔐 Roles",
        path: "/dashboard/role/list"
    },

    {
        group: "INVENTORY"
    },

    {
        title: "📊 Inventory Dashboard",
        path: "/dashboard/inventory/dashboard"
    },

    {
        title: "📦 Inventory List",
        path: "/dashboard/inventory/list"
    },

    {
        title: "➕ Add Inventory",
        path: "/dashboard/inventory/add"
    },

    {
        group: "PRODUCTION"
    },

    {
        title: "📊 Production Dashboard",
        path: "/dashboard/production/dashboard"
    },

    {
        title: "🏭 Production Orders",
        path: "/dashboard/production/list"
    },

    {
        title: "➕ New Production Order",
        path: "/dashboard/production/add"
    },

    {
        group: "DISPATCH"
    },

    {
        title: "📊 Dispatch Dashboard",
        path: "/dashboard/dispatch/dashboard"
    },

    {
        title: "🚚 Dispatches",
        path: "/dashboard/dispatch/list"
    },

    {
        title: "➕ New Dispatch",
        path: "/dashboard/dispatch/add"
    },

    {
        group: "BUYERS"
    },

    {
        title: "📊 Buyer Dashboard",
        path: "/dashboard/buyer/dashboard"
    },

    {
        title: "🛒 Buyer List",
        path: "/dashboard/buyer/list"
    },

    {
        title: "📋 Buyer Orders",
        path: "/dashboard/buyer/orders"
    }

];

const vendorMenu = [

    {
        title: "🏠 Dashboard",
        path: "/dashboard"
    },

    {
        group: "INVENTORY"
    },

    {
        title: "📊 Inventory Dashboard",
        path: "/dashboard/inventory/dashboard"
    },

    {
        title: "📦 Inventory List",
        path: "/dashboard/inventory/list"
    },

    {
        title: "➕ Add Inventory",
        path: "/dashboard/inventory/add"
    },

    {
        group: "PRODUCTION"
    },

    {
        title: "📊 Production Dashboard",
        path: "/dashboard/production/dashboard"
    },

    {
        title: "🏭 Production Orders",
        path: "/dashboard/production/list"
    },

    {
        title: "➕ New Production Order",
        path: "/dashboard/production/add"
    },

    {
        group: "DISPATCH"
    },

    {
        title: "📊 Dispatch Dashboard",
        path: "/dashboard/dispatch/dashboard"
    },

    {
        title: "🚚 Dispatches",
        path: "/dashboard/dispatch/list"
    },

    {
        title: "➕ New Dispatch",
        path: "/dashboard/dispatch/add"
    },

    {
        group: "BUYERS"
    },

    {
        title: "📊 Buyer Dashboard",
        path: "/dashboard/buyer/dashboard"
    },

    {
        title: "🛒 Buyer List",
        path: "/dashboard/buyer/list"
    },

    {
        title: "📋 Buyer Orders",
        path: "/dashboard/buyer/orders"
    }

];

const menuConfig = {

    DEFAULT: [
        {
            title: "🏠 Dashboard",
            path: "/dashboard"
        }
    ],

    ADMIN: adminMenu,

    SUPER_ADMIN: adminMenu,

    VENDOR: vendorMenu,

    STORE_MANAGER: vendorMenu

};

export default menuConfig;

// Roles come from the backend (already normalized to upper-case, without a
// ROLE_ prefix, by authService.saveSession). Fall back to a bare-bones
// DEFAULT menu for any role that isn't explicitly mapped above, instead of
// silently showing nothing but the dashboard link with no explanation.
export const getMenuForRole = (role) => {
    const key = String(role || "").trim().toUpperCase();
    return menuConfig[key] || menuConfig.DEFAULT;
};
