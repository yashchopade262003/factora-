import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dispatchService from "../../services/dispatchService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

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

function ViewDispatch() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dispatch, setDispatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDispatch(); }, []);

    const loadDispatch = async () => {
        try {
            const response = await dispatchService.getById(id);
            setDispatch(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load dispatch.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading dispatch details...</div>;
    }

    if (!dispatch) {
        return (
            <div style={{ padding: "16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px" }}>
                Dispatch Not Found
            </div>
        );
    }

    const rows = [
        { label: "Vendor ID", value: dispatch.vendorId },
        { label: "Buyer ID", value: dispatch.buyerId },
        { label: "Buyer Order ID", value: dispatch.buyerOrderId ?? "-" },
        { label: "Product Name", value: dispatch.productName },
        { label: "Quantity", value: `${dispatch.quantity} ${dispatch.unit || ""}` },
        { label: "Vehicle Number", value: dispatch.vehicleNumber },
        { label: "Driver Name", value: dispatch.driverName },
        { label: "Driver Phone", value: dispatch.driverPhone || "-" },
        { label: "Destination Address", value: dispatch.destinationAddress },
        { label: "Invoice Number", value: dispatch.invoiceNumber || "-" },
        { label: "Dispatch Date", value: dispatch.dispatchDate || "-" },
        { label: "Expected Delivery Date", value: dispatch.expectedDeliveryDate || "-" },
        { label: "Remarks", value: dispatch.remarks || "-" },
    ];

    return (
        <>
            <PageHeader title="Dispatch Details" subtitle={`Viewing details for ${dispatch.productName}`} />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{dispatch.productName}</h3>
                    <DeliveryStatusBadge status={dispatch.deliveryStatus} />
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
                    <Button onClick={() => navigate(`/dashboard/dispatch/edit/${dispatch.dispatchId}`)}>
                        Edit
                    </Button>
                    <Button color="#232f3e" textColor="white" onClick={() => navigate("/dashboard/dispatch/list")}>
                        ← Back to Dispatch
                    </Button>
                </div>
            </Card>
        </>
    );
}

export default ViewDispatch;
