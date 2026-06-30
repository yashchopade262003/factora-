import { Link, useLocation } from "react-router-dom";
import menuConfig from "../config/menuConfig";

function Sidebar() {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const location = useLocation();
    const menus = menuConfig[role] || [];

    return (
        <div style={{
            width: "240px", background: "#232f3e",
            color: "white", minHeight: "100vh",
            display: "flex", flexDirection: "column"
        }}>
            {/* User info */}
            <div style={{
                padding: "18px 16px",
                borderBottom: "1px solid #3a4a5c",
                background: "#1a2332"
            }}>
                <div style={{ fontSize: "12px", color: "#ff9900", marginBottom: "2px" }}>Account</div>
                <div style={{ fontWeight: "bold", fontSize: "15px" }}>{username || "User"}</div>
                <div style={{
                    display: "inline-block", marginTop: "6px",
                    background: "#ff9900", color: "#111",
                    padding: "2px 8px", borderRadius: "10px",
                    fontSize: "11px", fontWeight: "bold"
                }}>
                    {role || "USER"}
                </div>
            </div>

            {/* Menu items */}
            <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
                {menus.map((menu, index) => {
                    if (menu.group) {
                        return (
                            <div key={index} style={{
                                color: "#ff9900", fontSize: "10px",
                                fontWeight: "bold", letterSpacing: "1.2px",
                                textTransform: "uppercase",
                                padding: "14px 8px 6px",
                                borderTop: index > 0 ? "1px solid #3a4a5c" : "none",
                                marginTop: index > 0 ? "6px" : "0"
                            }}>
                                {menu.group}
                            </div>
                        );
                    }

                    const active = location.pathname === menu.path;

                    return (
                        <Link
                            key={index}
                            to={menu.path}
                            style={{
                                display: "block",
                                padding: "9px 12px",
                                marginBottom: "2px",
                                borderRadius: "3px",
                                textDecoration: "none",
                                background: active ? "#ff9900" : "transparent",
                                color: active ? "#111" : "#d5d9e0",
                                fontWeight: active ? "bold" : "normal",
                                fontSize: "13px",
                                borderLeft: active ? "3px solid #111" : "3px solid transparent",
                                transition: "background 0.15s"
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#3a4a5c"; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                        >
                            {menu.title}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{
                padding: "12px", borderTop: "1px solid #3a4a5c",
                textAlign: "center", color: "#8899aa", fontSize: "11px"
            }}>
                FactoryFlow ERP v1.0
            </div>
        </div>
    );
}

export default Sidebar;
