import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import buyerService from "../../services/buyerService";
import { getErrorMessage } from "../../utils/apiError";
import { isVendorScoped, getSessionVendorId } from "../../utils/vendorScope";
import { statusColors, NEXT_STATUS, canStartProduction, canCreateDispatch, canCancel } from "./orderWorkflow";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import ActionButtons from "../../components/common/ActionButtons";

function OrderStatusBadge({ status }) {
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

function OrderList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const vendorId = getSessionVendorId();
            const response = isVendorScoped() && vendorId
                ? await buyerService.findOrdersByVendor(vendorId)
                : await buyerService.getAllOrders();
            setOrders(response.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load buyer orders. The buyer service may be offline.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this order? This cannot be undone.")) return;
        try {
            await buyerService.removeOrder(id);
            setOrders((prev) => prev.filter((o) => o.orderId !== id));
        } catch (err) {
            console.error(err);
            alert("Unable to delete this order.");
        }
    };

    const advanceStatus = async (order) => {
        const next = NEXT_STATUS[order.status];
        if (!next) return;
        try {
            await buyerService.updateOrderStatus(order.orderId, next);
            loadOrders();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to update order status."));
        }
    };

    const cancelOrder = async (order) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await buyerService.updateOrderStatus(order.orderId, "CANCELLED");
            loadOrders();
        } catch (err) {
            alert(getErrorMessage(err, "Unable to cancel order."));
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => orders.indexOf(row) + 1 },
        { key: "productName", title: "Product" },
        { key: "quantity", title: "Qty", render: (row) => `${row.quantity} ${row.unit || ""}` },
        { key: "unitPrice", title: "Unit Price", render: (row) => `₹${row.unitPrice}` },
        { key: "totalAmount", title: "Total", render: (row) => `₹${row.totalAmount}` },
        { key: "status", title: "Status", render: (row) => <OrderStatusBadge status={row.status} /> },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {canStartProduction(row.status) && (
                        <Button onClick={() => navigate("/dashboard/production/add", { state: { fromOrder: row } })}>
                            Start Production
                        </Button>
                    )}
                    {canCreateDispatch(row.status) && (
                        <Button onClick={() => navigate("/dashboard/dispatch/add", { state: { fromOrder: row } })}>
                            Create Dispatch
                        </Button>
                    )}
                    {NEXT_STATUS[row.status] && (
                        <Button onClick={() => advanceStatus(row)}>Move to {NEXT_STATUS[row.status]}</Button>
                    )}
                    {canCancel(row.status) && (
                        <Button color="#b12704" textColor="white" onClick={() => cancelOrder(row)}>Cancel</Button>
                    )}
                    <ActionButtons
                        onEdit={() => navigate(`/dashboard/buyer/orders/edit/${row.orderId}`)}
                        onDelete={() => handleDelete(row.orderId)}
                    />
                </div>
            )
        },
    ];

    return (
        <>
            <PageHeader title="Buyer Orders" subtitle="Orders placed by buyers, from pending to delivered" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Order List</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button color="#64748B" onClick={() => navigate("/dashboard/buyer/list")}>View Buyers</Button>
                        <Button onClick={() => navigate("/dashboard/buyer/orders/add")}>+ New Order</Button>
                    </div>
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

export default OrderList;
