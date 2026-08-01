import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import inventoryService from "../../services/inventoryService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

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

function ViewInventory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadInventory(); }, []);

    const loadInventory = async () => {
        try {
            const response = await inventoryService.getById(id);
            setInventory(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load inventory.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading inventory details...</div>;
    }

    if (!inventory) {
        return (
            <div style={{ padding: "16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px" }}>
                Inventory Not Found
            </div>
        );
    }

    const rows = [
        { label: "Vendor ID", value: inventory.vendorId },
        { label: "Warehouse ID", value: inventory.warehouseId },
        { label: "Material Code", value: inventory.materialCode },
        { label: "Material Name", value: inventory.materialName },
        { label: "Category", value: inventory.materialCategory },
        { label: "Quantity", value: `${inventory.quantity ?? ""} ${inventory.unit || ""}` },
        { label: "Unit Price", value: `₹ ${inventory.unitPrice}` },
        { label: "Total Value", value: `₹ ${inventory.totalValue}` },
        { label: "Warehouse Location", value: inventory.warehouseLocation },
        { label: "Supplier ID", value: inventory.supplierId },
        { label: "Batch Number", value: inventory.batchNumber },
        { label: "Manufacturing Date", value: inventory.manufacturingDate || "-" },
        { label: "Expiry Date", value: inventory.expiryDate || "-" },
        { label: "Received Date", value: inventory.receivedDate || "-" },
        { label: "Minimum Stock Level", value: inventory.minimumStockLevel },
        { label: "Remarks", value: inventory.remarks || "-" },
    ];

    return (
        <>
            <PageHeader title="Inventory Details" subtitle={`Viewing details for ${inventory.materialName}`} />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{inventory.materialName}</h3>
                    <InventoryStatusBadge status={inventory.status} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{
                            display: "flex",
                            padding: "12px 16px",
                            borderBottom: "1px solid #e7e7e7",
                            background: i % 2 === 0 ? "white" : "#fafafa"
                        }}>
                            <div style={{ width: "160px", fontWeight: "bold", fontSize: "13px", color: "#565959", flexShrink: 0 }}>
                                {row.label}
                            </div>
                            <div style={{ fontSize: "13px", color: "#0f1111" }}>{row.value}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button onClick={() => navigate(`/dashboard/inventory/edit/${inventory.inventoryId}`)}>
                        Edit
                    </Button>
                    <Button color="#232f3e" textColor="white" onClick={() => navigate("/dashboard/inventory/list")}>
                        ← Back to Inventory
                    </Button>
                </div>
            </Card>
        </>
    );
}

export default ViewInventory;
