import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryService from "../../services/inventoryService";
import { fetchScoped } from "../../utils/vendorScope";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import ActionButtons from "../../components/common/ActionButtons";
const statusColors = {
    AVAILABLE: { background: "#067d62", color: "white" },
    LOW_STOCK: { background: "#e5a910", color: "#111" },
    OUT_OF_STOCK: { background: "#b12704", color: "white" },
    DAMAGED: { background: "#767676", color: "white" },
    RESERVED: { background: "#007185", color: "white" },
};

function InventoryStatusBadge({ status }) {
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

function InventoryList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadInventory(); }, []);

    const loadInventory = async () => {
        try {
            const response = await fetchScoped(inventoryService.getAll, inventoryService.findByVendor);
            setItems(response.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load inventory. The inventory service may be offline.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this inventory item? This cannot be undone.")) return;
        try {
            await inventoryService.remove(id);
            setItems((prev) => prev.filter((item) => item.inventoryId !== id));
        } catch (err) {
            console.error(err);
            alert("Unable to delete this item.");
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => items.indexOf(row) + 1 },
        { key: "materialCode", title: "Code" },
        { key: "materialName", title: "Material" },
        { key: "materialCategory", title: "Category" },
        { key: "quantity", title: "Qty", render: (row) => `${row.quantity} ${row.unit || ""}` },
        { key: "unitPrice", title: "Unit Price", render: (row) => `₹${row.unitPrice}` },
        { key: "totalValue", title: "Total Value", render: (row) => `₹${row.totalValue}` },
        { key: "warehouseLocation", title: "Warehouse" },
        { key: "status", title: "Status", render: (row) => <InventoryStatusBadge status={row.status} /> },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/dashboard/inventory/view/${row.inventoryId}`)}
                    onEdit={() => navigate(`/dashboard/inventory/edit/${row.inventoryId}`)}
                    onDelete={() => handleDelete(row.inventoryId)}
                />
            )
        },
    ];

    return (
        <>
            <PageHeader title="Inventory" subtitle="Materials stocked across all vendor warehouses" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Material List</h3>
                    <Button onClick={() => navigate("/dashboard/inventory/add")}>+ Add Material</Button>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px", marginBottom: "16px", fontSize: "13px" }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#767676" }}>Loading...</div>
                ) : (
                    !error && <DataTable columns={columns} data={items} />
                )}
            </Card>
        </>
    );
}

export default InventoryList;
