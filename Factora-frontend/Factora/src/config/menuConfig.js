const menuConfig = {

    ADMIN: [

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
            group: "OPERATIONS"
        },

        {
            title: "📦 Inventory",
            path: "/dashboard/inventory/list"
        },

        {
            title: "🏬 Warehouse",
            path: "/dashboard/warehouse/list"
        },

        {
            title: "🚚 Suppliers",
            path: "/dashboard/supplier/list"
        },

        {
            title: "🛒 Buyers",
            path: "/dashboard/buyer/list"
        },

        {
            group: "PRODUCTION"
        },

        {
            title: "🏭 Production",
            path: "/dashboard/production"
        },

        {
            title: "📊 Reports",
            path: "/dashboard/reports"
        }

    ],

    VENDOR: [

        {
            title: "🏠 Dashboard",
            path: "/dashboard"
        },

        {
            group: "OPERATIONS"
        },

        {
            title: "📦 Inventory",
            path: "/dashboard/inventory/list"
        },

        {
            title: "🚚 Suppliers",
            path: "/dashboard/supplier/list"
        },

        {
            title: "🛒 Buyers",
            path: "/dashboard/buyer/list"
        },

        {
            title: "📊 Reports",
            path: "/dashboard/reports"
        }

    ],

    STORE_MANAGER: [

        {
            title: "🏠 Dashboard",
            path: "/dashboard"
        },

        {
            group: "STORE"
        },

        {
            title: "📦 Inventory",
            path: "/dashboard/inventory/list"
        },

        {
            title: "🏬 Warehouse",
            path: "/dashboard/warehouse/list"
        }

    ]

};

export default menuConfig;