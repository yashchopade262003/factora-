import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import roleService from "../../services/roleService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";

function RoleList() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadRoles(); }, []);

    const loadRoles = async () => {
        try {
            const response = await roleService.getAllRoles();
            setRoles(response.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load roles.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => roles.indexOf(row) + 1 },
        { key: "roleName", title: "Role Name" },
        { key: "description", title: "Description" },
    ];

    return (
        <>
            <PageHeader title="Role Management" subtitle="Roles control what a user can access" />
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", color: "#0f1111", margin: 0 }}>Role List</h3>
                    <Button onClick={() => navigate("/dashboard/role/add")}>+ Add Role</Button>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#767676" }}>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={roles} />
                )}
            </Card>
        </>
    );
}

export default RoleList;
