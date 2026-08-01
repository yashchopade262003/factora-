import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import DashboardCard from "../components/common/DashboardCard";
import PageHeader from "../components/common/PageHeader";
import { isVendorScoped } from "../utils/vendorScope";

function Dashboard() {
    const username = localStorage.getItem("username");
    const role = (localStorage.getItem("role") || "").trim().toUpperCase();
    const navigate = useNavigate();
    const scoped = isVendorScoped();

    // Only ADMIN / SUPER_ADMIN are platform owners - every other role
    // (VENDOR, STORE_MANAGER, STAFF, DISPATCHER, or anything else created
    // later from the Roles screen) must never see vendor/user/role actions
    // or platform-wide stat cards, even though only VENDOR/STORE_MANAGER
    // are "vendor-scoped" for data-fetching purposes.
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        dashboardService.getDashboardData()
            .then((data) => { if (mounted) setStats(data); })
            .finally(() => { if (mounted) setLoading(false); });

        return () => { mounted = false; };
    }, []);

    // Only link to routes that actually exist in App.jsx. Vendor/store
    // manager/staff/dispatcher users don't get vendor-management or
    // user/role admin actions - those are platform-owner (ADMIN/SUPER_ADMIN)
    // only.
    const quickActions = isAdmin
        ? [
            { label: "🏭 Add Vendor", path: "/dashboard/vendor/add" },
            { label: "📋 View Vendors", path: "/dashboard/vendor/list" },
            { label: "📦 Add Inventory", path: "/dashboard/inventory/add" },
            { label: "📦 View Inventory", path: "/dashboard/inventory/list" },
            { label: "🏭 Start a Production Order", path: "/dashboard/production/add" },
            { label: "🚚 Add a Dispatch", path: "/dashboard/dispatch/add" },
            { label: "🛒 Add a Buyer Order", path: "/dashboard/buyer/orders/add" },
            { label: "👤 View Users", path: "/dashboard/user/list" },
            { label: "🔐 Manage Roles", path: "/dashboard/role/list" },
        ]
        : [
            { label: "📦 Add Inventory", path: "/dashboard/inventory/add" },
            { label: "📦 View Inventory", path: "/dashboard/inventory/list" },
            { label: "🏭 Start a Production Order", path: "/dashboard/production/add" },
            { label: "🚚 Add a Dispatch", path: "/dashboard/dispatch/add" },
            { label: "🛒 Add a Buyer Order", path: "/dashboard/buyer/orders/add" },
        ];

    return (
        <>
            <PageHeader
                title={`Welcome back, ${username || "User"} 👋`}
                subtitle={scoped ? "Your factory at a glance" : "FactoryFlow ERP Overview"}
            />

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "repeat(4,1fr)" : "repeat(2,1fr)", gap: "16px", marginBottom: "16px" }}>
                {isAdmin && <DashboardCard title="Vendors" value={loading ? "…" : stats.vendorCount} color="#ff9900" />}
                {isAdmin && <DashboardCard title="Users" value={loading ? "…" : stats.userCount} color="#007185" />}
                <DashboardCard title="Materials in Stock" value={loading ? "…" : stats.totalMaterials} color="#067d62" />
                <DashboardCard title="Low / Out of Stock" value={loading ? "…" : `${stats.lowStockMaterials + stats.outOfStockMaterials}`} color="#c45500" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "24px" }}>
                <DashboardCard title="Production In Progress" value={loading ? "…" : stats.productionInProgress} color="#e5a910" />
                <DashboardCard title="Dispatches On The Way" value={loading ? "…" : stats.dispatchPending} color="#2e86de" />
                <DashboardCard title="Open Buyer Orders" value={loading ? "…" : stats.openBuyerOrders} color="#8e44ad" />
            </div>

            {/* Quick links */}
            <div style={{
                background: "white", border: "1px solid #ddd",
                borderRadius: "4px", padding: "20px"
            }}>
                <h3 style={{ fontSize: "15px", marginBottom: "16px", color: "#0f1111", borderBottom: "2px solid #ff9900", paddingBottom: "8px", display: "inline-block" }}>
                    Quick Actions
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
                    {quickActions.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: "block", padding: "12px 16px",
                                background: "#f3f3f3", border: "1px solid #ddd",
                                borderRadius: "3px", color: "#007185",
                                textDecoration: "none", fontSize: "13px", fontWeight: "500",
                                cursor: "pointer", transition: "background 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#e7e9ec"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f3f3f3"}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
