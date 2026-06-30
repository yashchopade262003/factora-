import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import vendorService from "../../services/vendorService";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

function ViewVendor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);

    useEffect(() => { loadVendor(); }, []);

    const loadVendor = async () => {
        try {
            const response = await vendorService.getVendorById(id);
            setVendor(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    if (!vendor) {
        return (
            <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading vendor details...</div>
        );
    }

    const rows = [
        { label: "Vendor Code", value: vendor.vendorCode },
        { label: "Vendor Name", value: vendor.vendorName },
        { label: "Factory Name", value: vendor.factoryName },
        { label: "Owner Name", value: vendor.ownerName },
        { label: "Email", value: vendor.email },
        { label: "Phone", value: vendor.phone },
        { label: "GST Number", value: vendor.gstNumber },
        { label: "Address", value: vendor.address },
    ];

    return (
        <>
            <PageHeader title="Vendor Details" subtitle={`Viewing details for ${vendor.vendorName}`} />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{vendor.vendorName}</h3>
                    <StatusBadge status={vendor.status} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{
                            display: "flex",
                            padding: "12px 16px",
                            borderBottom: "1px solid #e7e7e7",
                            background: i % 2 === 0 ? "white" : "#fafafa"
                        }}>
                            <div style={{ width: "140px", fontWeight: "bold", fontSize: "13px", color: "#565959", flexShrink: 0 }}>
                                {row.label}
                            </div>
                            <div style={{ fontSize: "13px", color: "#0f1111" }}>{row.value}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "20px" }}>
                    <Button color="#232f3e" textColor="white" onClick={() => navigate("/dashboard/vendor/list")}>
                        ← Back to Vendors
                    </Button>
                </div>
            </Card>
        </>
    );
}

export default ViewVendor;
