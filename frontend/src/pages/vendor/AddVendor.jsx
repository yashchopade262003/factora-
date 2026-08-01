import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vendorService from "../../services/vendorService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";

function AddVendor() {

    const navigate = useNavigate();

    const [vendor, setVendor] = useState({
        vendorCode: "",
        vendorName: "",
        factoryName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        gstNumber: "",
        status: "ACTIVE"
    });

    const handleChange = (e) => {
        setVendor({
            ...vendor,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await vendorService.addVendor(vendor);
            alert("Vendor Added Successfully");
            navigate("/dashboard/vendor/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable To Add Vendor"));
        }
    };

    return (
        <FormContainer title="Add Vendor">
            <form onSubmit={handleSubmit}>
                <Label>Vendor Code</Label>
                <Input name="vendorCode" value={vendor.vendorCode} onChange={handleChange} />

                <Label>Vendor Name</Label>
                <Input name="vendorName" value={vendor.vendorName} onChange={handleChange} />

                <Label>Factory Name</Label>
                <Input name="factoryName" value={vendor.factoryName} onChange={handleChange} />

                <Label>Owner Name</Label>
                <Input name="ownerName" value={vendor.ownerName} onChange={handleChange} />

                <Label>Email</Label>
                <Input type="email" name="email" value={vendor.email} onChange={handleChange} />

                <Label>Phone</Label>
                <Input name="phone" value={vendor.phone} onChange={handleChange} />

                <Label>GST Number</Label>
                <Input name="gstNumber" value={vendor.gstNumber} onChange={handleChange} />

                <Label>Address</Label>
                <TextArea name="address" value={vendor.address} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">Save Vendor</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/vendor/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddVendor;
