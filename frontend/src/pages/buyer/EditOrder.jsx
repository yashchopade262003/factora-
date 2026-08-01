import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import buyerService from "../../services/buyerService";
import { getErrorMessage } from "../../utils/apiError";
import { ORDER_STATUSES } from "./orderWorkflow";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function EditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        vendorId: "",
        buyerId: "",
        productName: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        expectedDeliveryDate: "",
        status: ""
    });

    useEffect(() => { loadOrder(); }, []);

    const loadOrder = async () => {
        try {
            const response = await buyerService.getOrderById(id);
            setFormData(response.data.data);
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to load order."));
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
            await buyerService.updateOrder(id, formData);
            alert("Order Updated Successfully");
            navigate("/dashboard/buyer/orders");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Update Failed"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading order...</div>;
    }

    return (
        <FormContainer title="Edit Buyer Order">
            <form onSubmit={handleSubmit}>
                <div style={gridStyle}>
                    <div>
                        <Label>Vendor ID</Label>
                        <Input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Buyer ID</Label>
                        <Input type="number" name="buyerId" value={formData.buyerId} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Product Name</Label>
                        <Input name="productName" value={formData.productName} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Unit</Label>
                        <Input name="unit" value={formData.unit} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Unit Price</Label>
                        <Input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Expected Delivery Date</Label>
                        <Input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select name="status" value={formData.status} onChange={handleChange}>
                            {ORDER_STATUSES.map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Updating..." : "Update Order"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/buyer/orders")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default EditOrder;
