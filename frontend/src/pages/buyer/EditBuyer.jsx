import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import buyerService from "../../services/buyerService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function EditBuyer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        vendorId: "",
        buyerName: "",
        companyName: "",
        email: "",
        phone: "",
        gstNumber: "",
        address: "",
        status: ""
    });

    useEffect(() => { loadBuyer(); }, []);

    const loadBuyer = async () => {
        try {
            const response = await buyerService.getById(id);
            setFormData(response.data.data);
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to load buyer."));
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await buyerService.update(id, formData);
            alert("Buyer Updated Successfully");
            navigate("/dashboard/buyer/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Update Failed"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading buyer...</div>;
    }

    return (
        <FormContainer title="Edit Buyer">
            <form onSubmit={handleSubmit}>
                <div style={gridStyle}>
                    <div>
                        <Label>Vendor ID</Label>
                        <Input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Buyer Name</Label>
                        <Input name="buyerName" value={formData.buyerName} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Company Name</Label>
                        <Input name="companyName" value={formData.companyName || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Phone</Label>
                        <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>GST Number</Label>
                        <Input name="gstNumber" value={formData.gstNumber || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select name="status" value={formData.status} onChange={handleChange}>
                            <option>ACTIVE</option>
                            <option>INACTIVE</option>
                        </Select>
                    </div>
                    <div />
                </div>

                <Label>Address</Label>
                <TextArea name="address" value={formData.address || ""} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Updating..." : "Update Buyer"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/buyer/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default EditBuyer;
