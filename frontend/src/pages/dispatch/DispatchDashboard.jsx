import { useEffect, useState } from "react";
import dispatchService from "../../services/dispatchService";
import { fetchScoped } from "../../utils/vendorScope";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";

// No dedicated /dispatch/dashboard endpoint on the backend — this snapshot
// is built by pulling every dispatch once and summarising it here, the same
// approach used for Production and Buyer dashboards.
function DispatchDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inTransit: 0,
        delivered: 0,
        cancelled: 0,
        totalQuantity: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const response = await fetchScoped(dispatchService.getAll, dispatchService.findByVendor);
            const dispatches = response.data?.data || [];

            const summary = dispatches.reduce((acc, d) => {
                acc.total += 1;
                if (d.deliveryStatus === "PENDING") acc.pending += 1;
                if (d.deliveryStatus === "IN_TRANSIT") acc.inTransit += 1;
                if (d.deliveryStatus === "DELIVERED") acc.delivered += 1;
                if (d.deliveryStatus === "CANCELLED") acc.cancelled += 1;
                acc.totalQuantity += Number(d.quantity || 0);
                return acc;
            }, { total: 0, pending: 0, inTransit: 0, delivered: 0, cancelled: 0, totalQuantity: 0 });

            setStats(summary);
        } catch (error) {
            console.error(error);
            alert("Unable to load dispatch dashboard.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading dashboard...</div>;
    }

    return (
        <>
            <PageHeader title="Dispatch Dashboard" subtitle="Where every shipment stands, right now" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "16px" }}>
                <DashboardCard title="Total Dispatches" value={stats.total} color="#232f3e" />
                <DashboardCard title="Pending" value={stats.pending} color="#e5a910" />
                <DashboardCard title="In Transit" value={stats.inTransit} color="#007185" />
                <DashboardCard title="Delivered" value={stats.delivered} color="#067d62" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
                <DashboardCard title="Cancelled" value={stats.cancelled} color="#b12704" />
                <DashboardCard title="Total Quantity Dispatched" value={stats.totalQuantity.toLocaleString()} color="#ff9900" />
            </div>
        </>
    );
}

export default DispatchDashboard;
