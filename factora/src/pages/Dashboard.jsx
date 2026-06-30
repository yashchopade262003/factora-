import DashboardCard from "../components/common/DashboardCard";
import PageHeader from "../components/common/PageHeader";

function Dashboard() {
    const username = localStorage.getItem("username");

    return (
        <>
            <PageHeader
                title={`Welcome back, ${username || "User"} 👋`}
                subtitle="FactoryFlow ERP Overview"
            />

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
                <DashboardCard title="Vendors" value="15" color="#ff9900" />
                <DashboardCard title="Users" value="32" color="#007185" />
                <DashboardCard title="Inventory" value="120" color="#067d62" />
                <DashboardCard title="Orders" value="44" color="#c45500" />
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
                    {[
                        { label: "🏭 Add Vendor", path: "/dashboard/vendor/add" },
                        { label: "📋 View Vendors", path: "/dashboard/vendor/list" },
                        { label: "👤 View Users", path: "/dashboard/user/list" },
                        { label: "🔐 Manage Roles", path: "/dashboard/role/list" },
                        { label: "📦 Inventory", path: "/dashboard/inventory/list" },
                        { label: "📊 Reports", path: "/dashboard/reports" },
                    ].map((item, i) => (
                        <a key={i} href={item.path} style={{
                            display: "block", padding: "12px 16px",
                            background: "#f3f3f3", border: "1px solid #ddd",
                            borderRadius: "3px", color: "#007185",
                            textDecoration: "none", fontSize: "13px", fontWeight: "500",
                            transition: "background 0.15s"
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = "#e7e9ec"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f3f3f3"}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
