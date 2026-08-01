import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";

// Vendor
import VendorList from "./pages/vendor/VendorList";
import AddVendor from "./pages/vendor/AddVendor";
import ViewVendor from "./pages/vendor/ViewVendor";

// Role
import RoleList from "./pages/role/RoleList";
import AddRole from "./pages/role/AddRole";

// User
import UserList from "./pages/user/UserList";

// Inventory
import InventoryList from "./pages/inventory/InventoryList";
import AddInventory from "./pages/inventory/AddInventory";
import EditInventory from "./pages/inventory/EditInventory";
import ViewInventory from "./pages/inventory/ViewInventory";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";

// Production
import ProductionList from "./pages/production/ProductionList";
import AddProduction from "./pages/production/AddProduction";
import EditProduction from "./pages/production/EditProduction";
import ViewProduction from "./pages/production/ViewProduction";
import ProductionDashboard from "./pages/production/ProductionDashboard";

// Dispatch
import DispatchList from "./pages/dispatch/DispatchList";
import AddDispatch from "./pages/dispatch/AddDispatch";
import EditDispatch from "./pages/dispatch/EditDispatch";
import ViewDispatch from "./pages/dispatch/ViewDispatch";
import DispatchDashboard from "./pages/dispatch/DispatchDashboard";

// Buyer
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerList from "./pages/buyer/BuyerList";
import AddBuyer from "./pages/buyer/AddBuyer";
import EditBuyer from "./pages/buyer/EditBuyer";
import ViewBuyer from "./pages/buyer/ViewBuyer";
import OrderList from "./pages/buyer/OrderList";
import AddOrder from "./pages/buyer/AddOrder";
import EditOrder from "./pages/buyer/EditOrder";
function App() {

    return (

        <Routes>

            {/* ================= Public Routes ================= */}

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* ================= Protected Routes ================= */}

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                }
            >

                {/* Dashboard Home */}

                <Route index element={<Dashboard />} />

                {/* ================= Vendor ================= */}

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

                {/* ================= Role ================= */}

                <Route
                    path="role/list"
                    element={<RoleList />}
                />

                <Route
                    path="role/add"
                    element={<AddRole />}
                />

                {/* ================= User ================= */}

                <Route
                    path="user/list"
                    element={<UserList />}
                />

                {/* ================= Inventory ================= */}

                {/* Safety net: redirect bare /dashboard/inventory to the list */}
                <Route
                    path="inventory"
                    element={<Navigate to="list" replace />}
                />

                <Route
                    path="inventory/dashboard"
                    element={<InventoryDashboard />}
                />
                <Route
                    path="inventory/list"
                    element={<InventoryList />}
                />

                <Route
                    path="inventory/add"
                    element={<AddInventory />}
                />

                <Route
                    path="inventory/edit/:id"
                    element={<EditInventory />}
                />

                <Route
                    path="inventory/view/:id"
                    element={<ViewInventory />}
                />

                {/* ================= Production ================= */}

                <Route
                    path="production"
                    element={<Navigate to="list" replace />}
                />

                <Route
                    path="production/dashboard"
                    element={<ProductionDashboard />}
                />

                <Route
                    path="production/list"
                    element={<ProductionList />}
                />

                <Route
                    path="production/add"
                    element={<AddProduction />}
                />

                <Route
                    path="production/edit/:id"
                    element={<EditProduction />}
                />

                <Route
                    path="production/view/:id"
                    element={<ViewProduction />}
                />

                {/* ================= Dispatch ================= */}

                <Route
                    path="dispatch"
                    element={<Navigate to="list" replace />}
                />

                <Route
                    path="dispatch/dashboard"
                    element={<DispatchDashboard />}
                />

                <Route
                    path="dispatch/list"
                    element={<DispatchList />}
                />

                <Route
                    path="dispatch/add"
                    element={<AddDispatch />}
                />

                <Route
                    path="dispatch/edit/:id"
                    element={<EditDispatch />}
                />

                <Route
                    path="dispatch/view/:id"
                    element={<ViewDispatch />}
                />

                {/* ================= Buyer ================= */}

                <Route
                    path="buyer"
                    element={<Navigate to="list" replace />}
                />

                <Route
                    path="buyer/dashboard"
                    element={<BuyerDashboard />}
                />

                <Route
                    path="buyer/list"
                    element={<BuyerList />}
                />

                <Route
                    path="buyer/add"
                    element={<AddBuyer />}
                />

                <Route
                    path="buyer/edit/:id"
                    element={<EditBuyer />}
                />

                <Route
                    path="buyer/view/:id"
                    element={<ViewBuyer />}
                />

                <Route
                    path="buyer/orders"
                    element={<OrderList />}
                />

                <Route
                    path="buyer/orders/add"
                    element={<AddOrder />}
                />

                <Route
                    path="buyer/orders/edit/:id"
                    element={<EditOrder />}
                />

            </Route>

        </Routes>

    );

}

export default App;