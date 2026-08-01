import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productionService from "../../services/productionService";
import { getErrorMessage } from "../../utils/apiError";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";
import Button from "../../components/common/Button";

const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" };

function EditProduction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        vendorId: "",
        productName: "",
        rawMaterialInventoryId: "",
        rawMaterialQuantity: "",
        producedQuantity: "",
        unit: "",
        machineId: "",
        batchNumber: "",
        startDate: "",
        endDate: "",
        status: "",
        remarks: ""
    });

    useEffect(() => { loadOrder(); }, []);

    const loadOrder = async () => {
        try {
            const response = await productionService.getById(id);
            setFormData(response.data.data);
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to load production order."));
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
            await productionService.update(id, formData);
            alert("Production Order Updated Successfully");
            navigate("/dashboard/production/list");
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Update Failed"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div style={{ textAlign: "center", padding: "60px", color: "#767676" }}>Loading production order...</div>;
    }

    return (
        <FormContainer title="Edit Production Order">
            <form onSubmit={handleSubmit}>
                <div style={gridStyle}>
                    <div>
                        <Label>Vendor ID</Label>
                        <Input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Product Name</Label>
                        <Input name="productName" value={formData.productName} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Raw Material Inventory ID</Label>
                        <Input type="number" name="rawMaterialInventoryId" value={formData.rawMaterialInventoryId} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Raw Material Quantity</Label>
                        <Input type="number" name="rawMaterialQuantity" value={formData.rawMaterialQuantity} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Produced Quantity</Label>
                        <Input type="number" name="producedQuantity" value={formData.producedQuantity || ""} onChange={handleChange} />
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
                        <Label>Machine ID</Label>
                        <Input type="number" name="machineId" value={formData.machineId || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Batch Number</Label>
                        <Input name="batchNumber" value={formData.batchNumber || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select name="status" value={formData.status} onChange={handleChange}>
                            <option>PLANNED</option>
                            <option>IN_PROGRESS</option>
                            <option>COMPLETED</option>
                            <option>CANCELLED</option>
                        </Select>
                    </div>
                    <div />

                    <div>
                        <Label>Start Date</Label>
                        <Input type="date" name="startDate" value={formData.startDate || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Expected End Date</Label>
                        <Input type="date" name="endDate" value={formData.endDate || ""} onChange={handleChange} />
                    </div>
                </div>

                <Label>Remarks</Label>
                <TextArea name="remarks" value={formData.remarks || ""} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{loading ? "Updating..." : "Update Order"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/production/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default EditProduction;
