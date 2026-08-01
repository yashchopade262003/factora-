import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productionService from "../../services/productionService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

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

function ViewProduction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrder(); }, []);

    const loadOrder = async () => {
        try {
            const response = await productionService.getById(id);
            setOrder(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load production order.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading production order details...</div>;
    }

    if (!order) {
        return (
            <div style={{ padding: "16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px" }}>
                Production Order Not Found
            </div>
        );
    }

    const rows = [
        { label: "Vendor ID", value: order.vendorId },
        { label: "Product Name", value: order.productName },
        { label: "Raw Material Inventory ID", value: order.rawMaterialInventoryId },
        { label: "Raw Material Quantity", value: `${order.rawMaterialQuantity} ${order.unit || ""}` },
        { label: "Produced Quantity", value: order.producedQuantity ?? "-" },
        { label: "Machine ID", value: order.machineId ?? "-" },
        { label: "Batch Number", value: order.batchNumber || "-" },
        { label: "Start Date", value: order.startDate || "-" },
        { label: "End Date", value: order.endDate || "-" },
        { label: "Remarks", value: order.remarks || "-" },
    ];

    return (
        <>
            <PageHeader title="Production Order Details" subtitle={`Viewing details for ${order.productName}`} />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{order.productName}</h3>
                    <ProductionStatusBadge status={order.status} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{
                            display: "flex",
                            padding: "12px 16px",
                            borderBottom: "1px solid #e7e7e7",
                            background: i % 2 === 0 ? "white" : "#fafafa"
                        }}>
                            <div style={{ width: "180px", fontWeight: "bold", fontSize: "13px", color: "#565959", flexShrink: 0 }}>
                                {row.label}
                            </div>
                            <div style={{ fontSize: "13px", color: "#0f1111" }}>{row.value}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button onClick={() => navigate(`/dashboard/production/edit/${order.productionOrderId}`)}>
                        Edit
                    </Button>
                    <Button color="#232f3e" textColor="white" onClick={() => navigate("/dashboard/production/list")}>
                        ← Back to Production
                    </Button>
                </div>
            </Card>
        </>
    );
}

export default ViewProduction;
