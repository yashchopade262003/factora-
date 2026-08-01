import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productionService from "../../services/productionService";
import { getErrorMessage } from "../../utils/apiError";
import { fetchScoped } from "../../utils/vendorScope";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import ActionButtons from "../../components/common/ActionButtons";

const statusColors = {
    PLANNED: { background: "#007185", color: "white" },
    IN_PROGRESS: { background: "#e5a910", color: "#111" },
    COMPLETED: { background: "#067d62", color: "white" },
    CANCELLED: { background: "#b12704", color: "white" },
};

function ProductionStatusBadge({ status }) {
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

function ProductionList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const response = await fetchScoped(productionService.getAll, productionService.findByVendor);
            setOrders(response.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load production orders. The production service may be offline.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this production order? This cannot be undone.")) return;
        try {
            await productionService.remove(id);
            setOrders((prev) => prev.filter((order) => order.productionOrderId !== id));
        } catch (err) {
            console.error(err);
            alert("Unable to delete this production order.");
        }
    };

    const handleStart = async (id) => {
        try {
            await productionService.start(id);
            loadOrders();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to start production."));
        }
    };

    const handleComplete = async (id) => {
        const producedQuantity = window.prompt("Enter produced quantity:");
        if (!producedQuantity) return;
        try {
            await productionService.complete(id, Number(producedQuantity));
            loadOrders();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to complete production."));
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this production order?")) return;
        try {
            await productionService.cancel(id);
            loadOrders();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to cancel production."));
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => orders.indexOf(row) + 1 },
        { key: "productName", title: "Product" },
        { key: "rawMaterialQuantity", title: "Raw Material", render: (row) => `${row.rawMaterialQuantity} ${row.unit || ""}` },
        { key: "producedQuantity", title: "Produced Qty", render: (row) => row.producedQuantity ?? "-" },
        { key: "batchNumber", title: "Batch", render: (row) => row.batchNumber || "-" },
        { key: "status", title: "Status", render: (row) => <ProductionStatusBadge status={row.status} /> },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {row.status === "PLANNED" && (
                        <Button onClick={() => handleStart(row.productionOrderId)}>Start</Button>
                    )}
                    {row.status === "IN_PROGRESS" && (
                        <Button color="#067d62" textColor="white" onClick={() => handleComplete(row.productionOrderId)}>Complete</Button>
                    )}
                    {row.status !== "COMPLETED" && row.status !== "CANCELLED" && (
                        <Button color="#b12704" textColor="white" onClick={() => handleCancel(row.productionOrderId)}>Cancel</Button>
                    )}
                    <ActionButtons
                        onView={() => navigate(`/dashboard/production/view/${row.productionOrderId}`)}
                        onEdit={() => navigate(`/dashboard/production/edit/${row.productionOrderId}`)}
                        onDelete={() => handleDelete(row.productionOrderId)}
                    />
                </div>
            )
        },
    ];

    return (
        <>
            <PageHeader title="Production" subtitle="Production orders from raw material reservation to finished goods" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Production Orders</h3>
                    <Button onClick={() => navigate("/dashboard/production/add")}>+ New Production Order</Button>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px", marginBottom: "16px", fontSize: "13px" }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#767676" }}>Loading...</div>
                ) : (
                    !error && <DataTable columns={columns} data={orders} />
                )}
            </Card>
        </>
    );
}

export default ProductionList;
