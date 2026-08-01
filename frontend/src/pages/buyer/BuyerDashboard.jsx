import { useEffect, useState } from "react";
import buyerService from "../../services/buyerService";
import { isVendorScoped, getSessionVendorId } from "../../utils/vendorScope";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";

// No dedicated /buyer/dashboard endpoint on the backend — this snapshot is
// built by pulling buyers + buyer orders once and summarising them here,
// the same approach used for Production and Dispatch dashboards.
function BuyerDashboard() {
    const [stats, setStats] = useState({
        totalBuyers: 0,
        totalOrders: 0,
        pending: 0,
        inProduction: 0,
        readyForDispatch: 0,
        dispatched: 0,
        delivered: 0,
        totalOrderValue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const vendorId = getSessionVendorId();
            const scoped = isVendorScoped() && vendorId;

            const [buyersRes, ordersRes] = await Promise.all([
                scoped ? buyerService.findByVendor(vendorId) : buyerService.getAll(),
                scoped ? buyerService.findOrdersByVendor(vendorId) : buyerService.getAllOrders()
            ]);

            const buyers = buyersRes.data?.data || [];
            const orders = ordersRes.data?.data || [];

            const summary = orders.reduce((acc, o) => {
                acc.totalOrders += 1;
                if (o.status === "PENDING" || o.status === "CONFIRMED") acc.pending += 1;
                if (o.status === "IN_PRODUCTION") acc.inProduction += 1;
                if (o.status === "READY_FOR_DISPATCH") acc.readyForDispatch += 1;
                if (o.status === "DISPATCHED") acc.dispatched += 1;
                if (o.status === "DELIVERED") acc.delivered += 1;
                acc.totalOrderValue += Number(o.totalAmount || 0);
                return acc;
            }, { totalOrders: 0, pending: 0, inProduction: 0, readyForDispatch: 0, dispatched: 0, delivered: 0, totalOrderValue: 0 });

            setStats({ ...summary, totalBuyers: buyers.length });
        } catch (error) {
            console.error(error);
            alert("Unable to load buyer dashboard.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading dashboard...</div>;
    }

    return (
        <>
            <PageHeader title="Buyer Dashboard" subtitle="Buyers and their orders, at a glance" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "16px" }}>
                <DashboardCard title="Total Buyers" value={stats.totalBuyers} color="#232f3e" />
                <DashboardCard title="Total Orders" value={stats.totalOrders} color="#007185" />
                <DashboardCard title="Awaiting Action" value={stats.pending} color="#e5a910" />
                <DashboardCard title="In Production" value={stats.inProduction} color="#8e44ad" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
                <DashboardCard title="Ready for Dispatch" value={stats.readyForDispatch} color="#f0932b" />
                <DashboardCard title="Dispatched" value={stats.dispatched} color="#2e86de" />
                <DashboardCard title="Delivered" value={stats.delivered} color="#067d62" />
                <DashboardCard
                    title="Total Order Value"
                    value={`₹ ${stats.totalOrderValue.toLocaleString()}`}
                    color="#ff9900"
                />
            </div>
        </>
    );
}

export default BuyerDashboard;
