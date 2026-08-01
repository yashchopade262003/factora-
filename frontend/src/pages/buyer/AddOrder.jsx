import { useState } from "react";
import { useNavigate } from "react-router-dom";
import buyerService from "../../services/buyerService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function AddOrder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: "",
        buyerId: "",
        productName: "",
        quantity: "",
        unit: "Kg",
        unitPrice: "",
        expectedDeliveryDate: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await buyerService.addOrder(formData);
            alert("Order Placed Successfully");
            navigate("/dashboard/buyer/orders");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Failed to Place Order"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="New Buyer Order">
            <form onSubmit={handleSubmit}>
                <div style={gridStyle}>
                    <div>
                        <Label>Vendor ID</Label>
                        <Input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Buyer ID</Label>
                        <Input type="number" name="buyerId" value={formData.buyerId} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Product Name</Label>
                        <Input name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Unit</Label>
                        <Input name="unit" value={formData.unit} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Unit Price</Label>
                        <Input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Expected Delivery Date</Label>
                        <Input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} />
                    </div>
                    <div />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Placing..." : "Place Order"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/buyer/orders")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddOrder;
