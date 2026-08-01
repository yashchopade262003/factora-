import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryService from "../../services/inventoryService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function AddInventory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: "",
        warehouseId: "",
        materialCode: "",
        materialName: "",
        materialCategory: "",
        quantity: "",
        unit: "Kg",
        unitPrice: "",
        totalValue: 0,
        warehouseLocation: "",
        supplierId: "",
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
        receivedDate: "",
        status: "AVAILABLE",
        minimumStockLevel: "",
        remarks: ""
    });

    useEffect(() => {
        const qty = Number(formData.quantity || 0);
        const price = Number(formData.unitPrice || 0);
        setFormData(prev => ({ ...prev, totalValue: qty * price }));
    }, [formData.quantity, formData.unitPrice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await inventoryService.add(formData);
            alert("Inventory Added Successfully");
            navigate("/dashboard/inventory/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Failed to Add Inventory"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title="Add Inventory">
            <form onSubmit={handleSubmit}>
                <div style={gridStyle}>
                    <div>
                        <Label>Vendor ID</Label>
                        <Input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Warehouse ID</Label>
                        <Input type="number" name="warehouseId" value={formData.warehouseId} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Material Code</Label>
                        <Input name="materialCode" value={formData.materialCode} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Material Name</Label>
                        <Input name="materialName" value={formData.materialName} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Input name="materialCategory" value={formData.materialCategory} onChange={handleChange} />
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
                        <Label>Quantity</Label>
                        <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Unit Price</Label>
                        <Input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Total Value</Label>
                        <Input type="number" value={formData.totalValue} readOnly />
                    </div>
                    <div>
                        <Label>Warehouse Location</Label>
                        <Input name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Supplier ID</Label>
                        <Input type="number" name="supplierId" value={formData.supplierId} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Batch Number</Label>
                        <Input name="batchNumber" value={formData.batchNumber} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select name="status" value={formData.status} onChange={handleChange}>
                            <option>AVAILABLE</option>
                            <option>LOW_STOCK</option>
                            <option>OUT_OF_STOCK</option>
                            <option>DAMAGED</option>
                            <option>RESERVED</option>
                        </Select>
                    </div>
                    <div>
                        <Label>Minimum Stock Level</Label>
                        <Input type="number" name="minimumStockLevel" value={formData.minimumStockLevel} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label>Manufacturing Date</Label>
                        <Input type="date" name="manufacturingDate" value={formData.manufacturingDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Expiry Date</Label>
                        <Input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Received Date</Label>
                        <Input type="date" name="receivedDate" value={formData.receivedDate} onChange={handleChange} />
                    </div>
                    <div />
                </div>

                <Label>Remarks</Label>
                <TextArea name="remarks" value={formData.remarks} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Saving..." : "Save Inventory"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/inventory/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddInventory;
