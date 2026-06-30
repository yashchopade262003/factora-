import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";

import VendorList from "./pages/vendor/VendorList";
import AddVendor from "./pages/vendor/AddVendor";
import ViewVendor from "./pages/vendor/ViewVendor";

import RoleList from "./pages/role/RoleList";
import AddRole from "./pages/role/AddRole";

import UserList from "./pages/user/UserList";

function App() {

    return (

        <Routes>

            {/* Public Routes */}

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard */}

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                }
            >

                <Route
                    index
                    element={<Dashboard />}
                />

                {/* Vendor */}

                <Route
                    path="vendor/list"
                    element={<VendorList />}
                />

                <Route
                    path="vendor/add"
                    element={<AddVendor />}
                />

                <Route
                    path="vendor/view/:id"
                    element={<ViewVendor />}
                />

                {/* Role */}

                <Route
                    path="role/list"
                    element={<RoleList />}
                />

                <Route
                    path="role/add"
                    element={<AddRole />}
                />

                {/* User */}

                <Route
                    path="user/list"
                    element={<UserList />}
                />

            </Route>

        </Routes>

    );

}

export default App;