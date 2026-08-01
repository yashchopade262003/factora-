import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import vendorService from "../../services/vendorService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

function VendorList() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadVendors(); }, []);

    const loadVendors = async () => {
        try {
            const response = await vendorService.getAllVendors();
            setVendors(response.data);
        } catch (error) {
            console.log(error);
            alert("Unable to load vendors.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHeader title="Vendor Management" subtitle="Manage all registered vendors" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Vendor List</h3>
                    <Button onClick={() => navigate("/dashboard/vendor/add")}>+ Add Vendor</Button>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#767676" }}>Loading...</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ background: "#232f3e", color: "white" }}>
                                    {["#", "Vendor ID", "Code", "Vendor", "Factory", "Owner", "Email", "Phone", "Status", "Action"].map(h => (
                                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600", fontSize: "12px" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: "center", padding: "30px", color: "#767676" }}>
                                            No Vendors Found
                                        </td>
                                    </tr>
                                ) : (
                                    vendors.map((vendor, index) => (
                                        <tr key={vendor.vendorId} style={{ background: index % 2 === 0 ? "white" : "#f9f9f9" }}>
                                            <td style={td}>{index + 1}</td>
                                            <td style={td}>{vendor.vendorId}</td>
                                            <td style={td}><span style={{ color: "#007185", fontWeight: "500" }}>{vendor.vendorCode}</span></td>
                                            <td style={td}>{vendor.vendorName}</td>
                                            <td style={td}>{vendor.factoryName}</td>
                                            <td style={td}>{vendor.ownerName}</td>
                                            <td style={td}>{vendor.email}</td>
                                            <td style={td}>{vendor.phone}</td>
                                            <td style={td}><StatusBadge status={vendor.status} /></td>
                                            <td style={td}>
                                                <Button onClick={() => navigate(`/dashboard/vendor/view/${vendor.vendorId}`)}>
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </>
    );
}

const td = { padding: "10px 14px", borderBottom: "1px solid #e7e7e7", color: "#0f1111" };

export default VendorList;
