import { useState } from "react";
import { useNavigate } from "react-router-dom";
import roleService from "../../services/roleService";

import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import TextArea from "../../components/common/TextArea";
import Label from "../../components/common/Label";

function AddRole() {
    const navigate = useNavigate();

    const [role, setRole] = useState({
        roleName: "",
        description: ""
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await roleService.addRole(role);
            alert("Role Added Successfully");
            navigate("/dashboard/role/list");
        } catch (error) {
            console.error(error);
            alert("Unable To Add Role");
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormContainer title="Add Role">
            <form onSubmit={handleSubmit}>
                <Label>Role Name</Label>
                <Input name="roleName" placeholder="e.g. ADMIN, VENDOR, STORE_MANAGER" value={role.roleName} onChange={handleChange} required />

                <Label>Description</Label>
                <TextArea name="description" placeholder="What this role can do" value={role.description} onChange={handleChange} />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button type="submit">{saving ? "Saving..." : "Save Role"}</Button>
                    <Button color="#64748B" onClick={() => navigate("/dashboard/role/list")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
}

export default AddRole;
