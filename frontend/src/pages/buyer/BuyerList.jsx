import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import buyerService from "../../services/buyerService";
import { fetchScoped } from "../../utils/vendorScope";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import ActionButtons from "../../components/common/ActionButtons";

function StatusBadge({ status }) {
    const active = status === "ACTIVE";
    return (
        <span style={{
            background: active ? "#067d62" : "#767676", color: "white",
            padding: "3px 10px", borderRadius: "12px",
            fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.4px"
        }}>
            {status}
        </span>
    );
}

function BuyerList() {
    const navigate = useNavigate();
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadBuyers(); }, []);

    const loadBuyers = async () => {
        try {
            const response = await fetchScoped(buyerService.getAll, buyerService.findByVendor);
            setBuyers(response.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load buyers. The buyer service may be offline.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this buyer? This cannot be undone.")) return;
        try {
            await buyerService.remove(id);
            setBuyers((prev) => prev.filter((b) => b.buyerId !== id));
        } catch (err) {
            console.error(err);
            alert("Unable to delete this buyer.");
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => buyers.indexOf(row) + 1 },
        { key: "buyerName", title: "Buyer" },
        { key: "companyName", title: "Company" },
        { key: "email", title: "Email" },
        { key: "phone", title: "Phone" },
        { key: "status", title: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <ActionButtons
                    onView={() => navigate(`/dashboard/buyer/view/${row.buyerId}`)}
                    onEdit={() => navigate(`/dashboard/buyer/edit/${row.buyerId}`)}
                    onDelete={() => handleDelete(row.buyerId)}
                />
            )
        },
    ];

    return (
        <>
            <PageHeader title="Buyers" subtitle="Buyer records and their orders" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Buyer List</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button color="#64748B" onClick={() => navigate("/dashboard/buyer/orders")}>View Orders</Button>
                        <Button onClick={() => navigate("/dashboard/buyer/add")}>+ Add Buyer</Button>
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
                    !error && <DataTable columns={columns} data={buyers} />
                )}
            </Card>
        </>
    );
}

export default BuyerList;
