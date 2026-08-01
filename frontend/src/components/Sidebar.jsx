import { Link, useLocation } from "react-router-dom";
import { getMenuForRole } from "../config/menuConfig";
import { useSidebar } from "../context/SidebarContext";

function Sidebar() {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const location = useLocation();
    const menus = getMenuForRole(role);
    const { collapsed, toggleSidebar } = useSidebar();

    const width = collapsed ? "64px" : "240px";

    return (
        <div style={{
            width, minWidth: width, background: "#232f3e",
            color: "white", minHeight: "100vh",
            display: "flex", flexDirection: "column",
            transition: "width 0.18s ease, min-width 0.18s ease",
            overflow: "hidden"
        }}>
            {/* User info */}
            <div style={{
                padding: collapsed ? "18px 10px" : "18px 16px",
                borderBottom: "1px solid #3a4a5c",
                background: "#1a2332",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start"
            }}>
                {!collapsed && (
                    <div>
                        <div style={{ fontSize: "12px", color: "#ff9900", marginBottom: "2px" }}>Account</div>
                        <div style={{ fontWeight: "bold", fontSize: "15px", whiteSpace: "nowrap" }}>{username || "User"}</div>
                        <div style={{
                            display: "inline-block", marginTop: "6px",
                            background: "#ff9900", color: "#111",
                            padding: "2px 8px", borderRadius: "10px",
                            fontSize: "11px", fontWeight: "bold"
                        }}>
                            {role || "USER"}
                        </div>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    style={{
                        background: "transparent", border: "1px solid #3a4a5c",
                        color: "#d5d9e0", borderRadius: "3px", cursor: "pointer",
                        width: "26px", height: "26px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px"
                    }}
                >
                    {collapsed ? "»" : "«"}
                </button>
            </div>

            {/* Menu items */}
            <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
                {menus.map((menu, index) => {
                    if (menu.group) {
                        if (collapsed) return null;
                        return (
                            <div key={index} style={{
                                color: "#ff9900", fontSize: "10px",
                                fontWeight: "bold", letterSpacing: "1.2px",
                                textTransform: "uppercase",
                                padding: "14px 8px 6px",
                                borderTop: index > 0 ? "1px solid #3a4a5c" : "none",
                                marginTop: index > 0 ? "6px" : "0",
                                whiteSpace: "nowrap"
                            }}>
                                {menu.group}
                            </div>
                        );
                    }

                    const active = location.pathname === menu.path;
                    const [emoji, ...rest] = menu.title.split(" ");
                    const label = rest.join(" ");

                    return (
                        <Link
                            key={index}
                            to={menu.path}
                            title={collapsed ? label : undefined}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: collapsed ? "center" : "flex-start",
                                padding: collapsed ? "10px 0" : "9px 12px",
                                marginBottom: "2px",
                                borderRadius: "3px",
                                textDecoration: "none",
                                background: active ? "#ff9900" : "transparent",
                                color: active ? "#111" : "#d5d9e0",
                                fontWeight: active ? "bold" : "normal",
                                fontSize: "13px",
                                whiteSpace: "nowrap",
                                borderLeft: active ? "3px solid #111" : "3px solid transparent",
                                transition: "background 0.15s"
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#3a4a5c"; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                        >
                            {collapsed ? emoji : menu.title}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            {!collapsed && (
                <div style={{
                    padding: "12px", borderTop: "1px solid #3a4a5c",
                    textAlign: "center", color: "#8899aa", fontSize: "11px", whiteSpace: "nowrap"
                }}>
                    FactoryFlow ERP v1.0
                </div>
            )}
        </div>
    );
}

export default Sidebar;
