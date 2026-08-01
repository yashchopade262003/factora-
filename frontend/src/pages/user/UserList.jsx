import { useEffect, useState } from "react";
import userService from "../../services/userService";
import roleService from "../../services/roleService";
import vendorService from "../../services/vendorService";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";

function UserList() {
    const [users, setUsers] = useState([]);
    const [roleMap, setRoleMap] = useState({});
    const [vendorMap, setVendorMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [usersRes, rolesRes, vendorsRes] = await Promise.all([
                userService.getAllUsers(),
                roleService.getAllRoles(),
                vendorService.getAllVendors()
            ]);

            setUsers(usersRes.data);

            const rMap = {};
            rolesRes.data.forEach((r) => { rMap[r.roleId] = r.roleName; });
            setRoleMap(rMap);

            const vMap = {};
            vendorsRes.data.forEach((v) => { vMap[v.vendorId] = v.vendorName; });
            setVendorMap(vMap);
        } catch (error) {
            console.error(error);
            alert("Unable to load users.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: "index", title: "#", render: (row) => users.indexOf(row) + 1 },
        { key: "username", title: "Name" },
        { key: "email", title: "Email" },
        { key: "phone", title: "Phone" },
        { key: "role", title: "Role", render: (row) => roleMap[row.roleId] || row.roleId },
        { key: "vendor", title: "Vendor", render: (row) => vendorMap[row.vendorId] || row.vendorId },
        { key: "status", title: "Status", render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <>
            <PageHeader title="User Management" subtitle="Everyone registered to FactoryFlow ERP" />
            <Card>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#767676" }}>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={users} />
                )}
            </Card>
        </>
    );
}

export default UserList;
