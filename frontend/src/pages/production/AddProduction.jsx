import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productionService from "../../services/productionService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function AddProduction() {
    const navigate = useNavigate();
    const location = useLocation();

    // Populated when arriving via the "Start Production" action on an
    // IN_PRODUCTION buyer order (see buyer/OrderList.jsx). Carrying the
    // buyerOrderId through means ProductionService can link completion
    // back to this exact order automatically instead of relying on its
    // FIFO vendorId+productName fallback match.
    const fromOrder = location.state?.fromOrder;

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: fromOrder?.vendorId ?? "",
        buyerOrderId: fromOrder?.orderId ?? "",
        productName: fromOrder?.productName ?? "",
        rawMaterialInventoryId: "",
        rawMaterialQuantity: fromOrder?.quantity ?? "",
        unit: fromOrder?.unit ?? "Kg",
        machineId: "",
        batchNumber: "",
        startDate: "",
        endDate: "",
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
            await productionService.add(formData);
            alert("Production Order Created Successfully");
            navigate("/dashboard/production/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Failed to Create Production Order"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="New Production Order">
            {fromOrder && (
                <div style={{
                    padding: "10px 14px", background: "#eef6ff", border: "1px solid #b8d8f2",
                    color: "#0f4c81", borderRadius: "3px", marginBottom: "16px", fontSize: "13px"
                }}>
                    Producing for Buyer Order #{fromOrder.orderId} ({fromOrder.productName}) - fields below are
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
                        <Label>Product Name</Label>
                        <Input name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Buyer Order ID (optional)</Label>
                        <Input type="number" name="buyerOrderId" value={formData.buyerOrderId} onChange={handleChange} />
                    </div>
                    <div />

                    <div>
                        <Label>Raw Material Inventory ID</Label>
                        <Input type="number" name="rawMaterialInventoryId" value={formData.rawMaterialInventoryId} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Raw Material Quantity</Label>
                        <Input type="number" name="rawMaterialQuantity" value={formData.rawMaterialQuantity} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Unit</Label>
                        <Select name="unit" value={formData.unit} onChange={handleChange}>
                            <option>Kg</option>
                            <option>Ton</option>
                            <option>Piece</option>
                            <option>Liter</option>
                        </Select>
                    </div>
                    <div>
                        <Label>Machine ID (optional)</Label>
                        <Input type="number" name="machineId" value={formData.machineId} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Batch Number</Label>
                        <Input name="batchNumber" value={formData.batchNumber} onChange={handleChange} />
                    </div>
                    <div />

                    <div>
                        <Label>Start Date</Label>
                        <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Expected End Date</Label>
                        <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </div>
                </div>

                <Label>Remarks</Label>
                <TextArea name="remarks" value={formData.remarks} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Saving..." : "Create Order"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/production/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddProduction;
