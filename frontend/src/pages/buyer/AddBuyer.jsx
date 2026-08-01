import { useState } from "react";
import { useNavigate } from "react-router-dom";
import buyerService from "../../services/buyerService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function AddBuyer() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: "",
        buyerName: "",
        companyName: "",
        email: "",
        phone: "",
        gstNumber: "",
        address: "",
        status: "ACTIVE"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await buyerService.add(formData);
            alert("Buyer Added Successfully");
            navigate("/dashboard/buyer/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Failed to Add Buyer"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="Add Buyer">
            <form onSubmit={handleSubmit}>
                <div style={gridStyle}>
                    <div>
                        <Label>Vendor ID</Label>
                        <Input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Buyer Name</Label>
                        <Input name="buyerName" value={formData.buyerName} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Company Name</Label>
                        <Input name="companyName" value={formData.companyName} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Phone</Label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>GST Number</Label>
                        <Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                    </div>
                </div>

                <Label>Address</Label>
                <TextArea name="address" value={formData.address} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Saving..." : "Save Buyer"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/buyer/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddBuyer;
