import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dispatchService from "../../services/dispatchService";
import { getErrorMessage } from "../../utils/apiError";
import { fetchScoped } from "../../utils/vendorScope";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import ActionButtons from "../../components/common/ActionButtons";

const statusColors = {
    PENDING: { background: "#e5a910", color: "#111" },
    IN_TRANSIT: { background: "#007185", color: "white" },
    DELIVERED: { background: "#067d62", color: "white" },
    CANCELLED: { background: "#b12704", color: "white" },
};

function DeliveryStatusBadge({ status }) {
    const style = statusColors[status] || { background: "#767676", color: "white" };
    return (
        <span style={{
            ...style, padding: "3px 10px", borderRadius: "12px",
            fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.4px"
        }}>
            {status}
        </span>
    );
}

function DispatchList() {
    const navigate = useNavigate();
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadDispatches(); }, []);

    const loadDispatches = async () => {
        try {
            const response = await fetchScoped(dispatchService.getAll, dispatchService.findByVendor);
            setDispatches(response.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load dispatches. The dispatch service may be offline.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this dispatch record? This cannot be undone.")) return;
        try {
            await dispatchService.remove(id);
            setDispatches((prev) => prev.filter((d) => d.dispatchId !== id));
        } catch (err) {
            console.error(err);
            alert("Unable to delete this dispatch.");
        }
    };

    const handleInTransit = async (id) => {
        try {
            await dispatchService.markInTransit(id);
            loadDispatches();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to update dispatch."));
        }
    };

    const handleDelivered = async (id) => {
        try {
            await dispatchService.markDelivered(id);
            loadDispatches();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to update dispatch."));
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this dispatch?")) return;
        try {
            await dispatchService.cancel(id);
            loadDispatches();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to cancel dispatch."));
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => dispatches.indexOf(row) + 1 },
        { key: "productName", title: "Product" },
        { key: "quantity", title: "Qty", render: (row) => `${row.quantity} ${row.unit || ""}` },
        { key: "vehicleNumber", title: "Vehicle" },
        { key: "driverName", title: "Driver" },
        { key: "destinationAddress", title: "Destination" },
        { key: "deliveryStatus", title: "Status", render: (row) => <DeliveryStatusBadge status={row.deliveryStatus} /> },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {row.deliveryStatus === "PENDING" && (
                        <Button onClick={() => handleInTransit(row.dispatchId)}>Dispatch</Button>
                    )}
                    {row.deliveryStatus === "IN_TRANSIT" && (
                        <Button color="#067d62" textColor="white" onClick={() => handleDelivered(row.dispatchId)}>Delivered</Button>
                    )}
                    {row.deliveryStatus !== "DELIVERED" && row.deliveryStatus !== "CANCELLED" && (
                        <Button color="#b12704" textColor="white" onClick={() => handleCancel(row.dispatchId)}>Cancel</Button>
                    )}
                    <ActionButtons
                        onView={() => navigate(`/dashboard/dispatch/view/${row.dispatchId}`)}
                        onEdit={() => navigate(`/dashboard/dispatch/edit/${row.dispatchId}`)}
                        onDelete={() => handleDelete(row.dispatchId)}
                    />
                </div>
            )
        },
    ];

    return (
        <>
            <PageHeader title="Dispatch" subtitle="Track shipments from factory to buyer" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Dispatches</h3>
                    <Button onClick={() => navigate("/dashboard/dispatch/add")}>+ New Dispatch</Button>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px", marginBottom: "16px", fontSize: "13px" }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#767676" }}>Loading...</div>
                ) : (
                    !error && <DataTable columns={columns} data={dispatches} />
                )}
            </Card>
        </>
    );
}

export default DispatchList;
