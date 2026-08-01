import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dispatchService from "../../services/dispatchService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function AddDispatch() {
    const navigate = useNavigate();
    const location = useLocation();

    // Populated when arriving via the "Create Dispatch" action on a
    // READY_FOR_DISPATCH buyer order (see buyer/OrderList.jsx), so the
    // person dispatching goods doesn't have to look up and retype the
    // vendor/buyer/product/quantity that are already on the order.
    const fromOrder = location.state?.fromOrder;

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: fromOrder?.vendorId ?? "",
        buyerOrderId: fromOrder?.orderId ?? "",
        buyerId: fromOrder?.buyerId ?? "",
        finishedGoodsInventoryId: "",
        productName: fromOrder?.productName ?? "",
        quantity: fromOrder?.quantity ?? "",
        unit: fromOrder?.unit ?? "Kg",
        vehicleNumber: "",
        driverName: "",
        driverPhone: "",
        destinationAddress: "",
        invoiceNumber: "",
        dispatchDate: "",
        expectedDeliveryDate: fromOrder?.expectedDeliveryDate ?? "",
        remarks: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await dispatchService.add(formData);
            alert("Dispatch Created Successfully");
            navigate("/dashboard/dispatch/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Failed to Create Dispatch"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="New Dispatch">
            {fromOrder && (
                <div style={{
                    padding: "10px 14px", background: "#eef6ff", border: "1px solid #b8d8f2",
                    color: "#0f4c81", borderRadius: "3px", marginBottom: "16px", fontSize: "13px"
                }}>
                    Fulfilling Buyer Order #{fromOrder.orderId} ({fromOrder.productName}) - fields below are
                    pre-filled from the order, adjust as needed.
                </div>
            )}
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
                        <Label>Buyer Order ID (optional)</Label>
                        <Input type="number" name="buyerOrderId" value={formData.buyerOrderId} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Finished Goods Inventory ID (optional)</Label>
                        <Input type="number" name="finishedGoodsInventoryId" value={formData.finishedGoodsInventoryId} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Product Name</Label>
                        <Input name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Quantity</Label>
                        <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Unit</Label>
                        <Input name="unit" value={formData.unit} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Invoice Number</Label>
                        <Input name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Vehicle Number</Label>
                        <Input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Driver Name</Label>
                        <Input name="driverName" value={formData.driverName} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Driver Phone</Label>
                        <Input name="driverPhone" value={formData.driverPhone} onChange={handleChange} />
                    </div>
                    <div />

                    <div>
                        <Label>Dispatch Date</Label>
                        <Input type="date" name="dispatchDate" value={formData.dispatchDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Expected Delivery Date</Label>
                        <Input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} />
                    </div>
                </div>

                <Label>Destination Address</Label>
                <TextArea name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} required />

                <Label>Remarks</Label>
                <TextArea name="remarks" value={formData.remarks} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Saving..." : "Create Dispatch"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/dispatch/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddDispatch;
