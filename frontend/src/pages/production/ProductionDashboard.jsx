import { useEffect, useRef, useState } from "react";
import productionService from "../../services/productionService";
import dispatchService from "../../services/dispatchService";
import { fetchScoped } from "../../utils/vendorScope";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";
import Card from "../../components/common/Card";

// How often to re-check Dispatch Service for new activity. There is no
// push/event mechanism between services (no message broker configured in
// this project), so short polling is the simplest reliable way to keep
// Production "in the loop" as soon as a dispatch is created elsewhere in
// the app - without needing any backend changes.
const DISPATCH_POLL_INTERVAL_MS = 15000;

// There is no dedicated /production/dashboard endpoint on the backend, so
// this snapshot is built by pulling every production order once and
// summarising it here — same trick used for the Buyer and Dispatch
// dashboards. Keeps the "at a glance" experience for non-technical users
// without needing a new backend API.
function ProductionDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        planned: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalRawMaterialQty: 0,
        totalProducedQty: 0
    });
    const [loading, setLoading] = useState(true);

    const [recentDispatches, setRecentDispatches] = useState([]);
    const [dispatchAlert, setDispatchAlert] = useState(null);
    const seenDispatchIds = useRef(new Set());
    const isFirstDispatchLoad = useRef(true);

    useEffect(() => {
        loadDashboard();
        loadRecentDispatches();

        const intervalId = setInterval(loadRecentDispatches, DISPATCH_POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await fetchScoped(productionService.getAll, productionService.findByVendor);
            const orders = response.data?.data || response.data || [];

            const summary = orders.reduce((acc, o) => {
                acc.total += 1;
                if (o.status === "PLANNED") acc.planned += 1;
                if (o.status === "IN_PROGRESS") acc.inProgress += 1;
                if (o.status === "COMPLETED") acc.completed += 1;
                if (o.status === "CANCELLED") acc.cancelled += 1;
                acc.totalRawMaterialQty += Number(o.rawMaterialQuantity || 0);
                acc.totalProducedQty += Number(o.producedQuantity || 0);
                return acc;
            }, { total: 0, planned: 0, inProgress: 0, completed: 0, cancelled: 0, totalRawMaterialQty: 0, totalProducedQty: 0 });

            setStats(summary);
        } catch (error) {
            console.error(error);
            alert("Unable to load production dashboard.");
        } finally {
            setLoading(false);
        }
    };

    // Keeps Production Manager aware of dispatch activity in near real-time:
    // pulls the latest dispatches, and — if any dispatch IDs weren't seen on
    // the previous poll — surfaces a banner so the change is impossible to miss.
    const loadRecentDispatches = async () => {
        try {
            const response = await fetchScoped(dispatchService.getAll, dispatchService.findByVendor);
            const dispatches = response.data?.data || response.data || [];

            const sorted = [...dispatches].sort((a, b) => (b.dispatchId || 0) - (a.dispatchId || 0));
            const latest = sorted.slice(0, 5);

            if (!isFirstDispatchLoad.current) {
                const newOnes = latest.filter(d => !seenDispatchIds.current.has(d.dispatchId));
                if (newOnes.length > 0) {
                    const names = newOnes.map(d => `#${d.dispatchId} (${d.productName || "item"})`).join(", ");
                    setDispatchAlert(`New dispatch created: ${names}`);
                }
            }

            seenDispatchIds.current = new Set(sorted.map(d => d.dispatchId));
            isFirstDispatchLoad.current = false;
            setRecentDispatches(latest);
        } catch (error) {
            // Non-critical widget — don't block the whole dashboard if
            // Dispatch Service is briefly unreachable.
            console.error("Unable to load recent dispatch activity:", error);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading dashboard...</div>;
    }

    return (
        <>
            <PageHeader title="Production Dashboard" subtitle="Snapshot of every production order, right now" />

            {dispatchAlert && (
                <div
                    style={{
                        background: "#fff8e1",
                        border: "1px solid #e5a910",
                        color: "#7a5b00",
                        borderRadius: "4px",
                        padding: "10px 14px",
                        marginBottom: "16px",
                        fontSize: "13px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <span>🔔 {dispatchAlert}</span>
                    <button
                        onClick={() => setDispatchAlert(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#7a5b00", fontWeight: "bold" }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "16px" }}>
                <DashboardCard title="Total Orders" value={stats.total} color="#232f3e" />
                <DashboardCard title="Planned" value={stats.planned} color="#007185" />
                <DashboardCard title="In Progress" value={stats.inProgress} color="#e5a910" />
                <DashboardCard title="Completed" value={stats.completed} color="#067d62" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "16px" }}>
                <DashboardCard title="Cancelled" value={stats.cancelled} color="#b12704" />
                <DashboardCard title="Raw Material Used" value={stats.totalRawMaterialQty.toLocaleString()} color="#ff9900" />
                <DashboardCard title="Produced Quantity" value={stats.totalProducedQty.toLocaleString()} color="#067d62" />
            </div>

            <Card>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#0f1111" }}>Recent Dispatch Activity</h3>
                {recentDispatches.length === 0 ? (
                    <div style={{ color: "#767676", fontSize: "13px" }}>No dispatches yet.</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {recentDispatches.map(d => (
                            <div
                                key={d.dispatchId}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "13px",
                                    borderBottom: "1px solid #eee",
                                    paddingBottom: "6px"
                                }}
                            >
                                <span>
                                    <strong>#{d.dispatchId}</strong> — {d.productName} ({d.quantity} {d.unit})
                                </span>
                                <span style={{ color: "#767676" }}>{d.deliveryStatus}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </>
    );
}

export default ProductionDashboard;
