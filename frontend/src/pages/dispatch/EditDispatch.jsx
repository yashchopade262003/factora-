import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dispatchService from "../../services/dispatchService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function EditDispatch() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        vendorId: "",
        buyerOrderId: "",
        buyerId: "",
        finishedGoodsInventoryId: "",
        productName: "",
        quantity: "",
        unit: "",
        vehicleNumber: "",
        driverName: "",
        driverPhone: "",
        destinationAddress: "",
        invoiceNumber: "",
        dispatchDate: "",
        expectedDeliveryDate: "",
        deliveryStatus: "",
        remarks: ""
    });

    useEffect(() => { loadDispatch(); }, []);

    const loadDispatch = async () => {
        try {
            const response = await dispatchService.getById(id);
            setFormData(response.data.data);
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to load dispatch."));
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
            await dispatchService.update(id, formData);
            alert("Dispatch Updated Successfully");
            navigate("/dashboard/dispatch/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Update Failed"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading dispatch...</div>;
    }

    return (
        <FormContainer title="Edit Dispatch">
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
                        <Label>Buyer Order ID</Label>
                        <Input type="number" name="buyerOrderId" value={formData.buyerOrderId || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Finished Goods Inventory ID</Label>
                        <Input type="number" name="finishedGoodsInventoryId" value={formData.finishedGoodsInventoryId || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Product Name</Label>
                        <Input name="productName" value={formData.productName} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Quantity</Label>
                        <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Unit</Label>
                        <Input name="unit" value={formData.unit} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Invoice Number</Label>
                        <Input name="invoiceNumber" value={formData.invoiceNumber || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Vehicle Number</Label>
                        <Input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Driver Name</Label>
                        <Input name="driverName" value={formData.driverName} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Driver Phone</Label>
                        <Input name="driverPhone" value={formData.driverPhone || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Delivery Status</Label>
                        <Select name="deliveryStatus" value={formData.deliveryStatus} onChange={handleChange}>
                            <option>PENDING</option>
                            <option>IN_TRANSIT</option>
                            <option>DELIVERED</option>
                            <option>CANCELLED</option>
                        </Select>
                    </div>

                    <div>
                        <Label>Dispatch Date</Label>
                        <Input type="date" name="dispatchDate" value={formData.dispatchDate || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Expected Delivery Date</Label>
                        <Input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate || ""} onChange={handleChange} />
                    </div>
                </div>

                <Label>Destination Address</Label>
                <TextArea name="destinationAddress" value={formData.destinationAddress || ""} onChange={handleChange} />

                <Label>Remarks</Label>
                <TextArea name="remarks" value={formData.remarks || ""} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Updating..." : "Update Dispatch"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/dispatch/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default EditDispatch;
