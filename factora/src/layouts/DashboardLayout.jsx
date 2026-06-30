import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/common/Breadcrumb";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <div style={{ display: "flex", height: "100vh", background: "#f3f3f3" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Navbar />
                {/* Amazon orange accent */}
                <div style={{ height: "3px", background: "#ff9900", flexShrink: 0 }} />
                <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                    <Breadcrumb />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
