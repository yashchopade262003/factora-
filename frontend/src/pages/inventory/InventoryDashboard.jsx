import { useEffect, useState } from "react";
import inventoryService from "../../services/inventoryService";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";

function InventoryDashboard() {
    const [dashboard, setDashboard] = useState({
        totalMaterials: 0,
        availableMaterials: 0,
        lowStockMaterials: 0,
        outOfStockMaterials: 0,
        inventoryValue: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const response = await inventoryService.dashboard();
            setDashboard(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading dashboard...</div>;
    }

    return (
        <>
            <PageHeader title="Inventory Dashboard" subtitle="Live snapshot of stock across all warehouses" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "16px" }}>
                <DashboardCard title="Total Materials" value={dashboard.totalMaterials} color="#ff9900" />
                <DashboardCard title="Available Materials" value={dashboard.availableMaterials} color="#067d62" />
                <DashboardCard title="Low Stock" value={dashboard.lowStockMaterials} color="#e5a910" />
                <DashboardCard title="Out Of Stock" value={dashboard.outOfStockMaterials} color="#b12704" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <DashboardCard
                    title="Inventory Value"
                    value={`₹ ${Number(dashboard.inventoryValue || 0).toLocaleString()}`}
                    color="#232f3e"
                />
            </div>
        </>
    );
}

export default InventoryDashboard;
