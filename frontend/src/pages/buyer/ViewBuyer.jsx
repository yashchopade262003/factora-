import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import buyerService from "../../services/buyerService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

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

function ViewBuyer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [buyer, setBuyer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadBuyer(); }, []);

    const loadBuyer = async () => {
        try {
            const response = await buyerService.getById(id);
            setBuyer(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load buyer.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading buyer details...</div>;
    }

    if (!buyer) {
        return (
            <div style={{ padding: "16px", background: "#fdf2f2", border: "1px solid #f2b8b8", color: "#b12704", borderRadius: "3px" }}>
                Buyer Not Found
            </div>
        );
    }

    const rows = [
        { label: "Vendor ID", value: buyer.vendorId },
        { label: "Company Name", value: buyer.companyName || "-" },
        { label: "Email", value: buyer.email || "-" },
        { label: "Phone", value: buyer.phone || "-" },
        { label: "GST Number", value: buyer.gstNumber || "-" },
        { label: "Address", value: buyer.address || "-" },
    ];

    return (
        <>
            <PageHeader title="Buyer Details" subtitle={`Viewing details for ${buyer.buyerName}`} />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{buyer.buyerName}</h3>
                    <StatusBadge status={buyer.status} />
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
                    <Button onClick={() => navigate(`/dashboard/buyer/edit/${buyer.buyerId}`)}>
                        Edit
                    </Button>
                    <Button color="#232f3e" textColor="white" onClick={() => navigate("/dashboard/buyer/list")}>
                        ← Back to Buyers
                    </Button>
                </div>
            </Card>
        </>
    );
}

export default ViewBuyer;
