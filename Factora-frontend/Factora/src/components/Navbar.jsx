import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div style={{
            height: "60px", background: "#131921",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "0 20px",
            boxShadow: "0 2px 4px rgba(0,0,0,.3)"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#ff9900" }}>
                    🏭 FactoryFlow ERP
                </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px", cursor: "pointer", color: "#ddd" }} title="Notifications">🔔</span>

                <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#ccc", fontSize: "11px" }}>Hello, {username}</div>
                    <div style={{ color: "#ff9900", fontSize: "12px", fontWeight: "bold" }}>{role}</div>
                </div>

                <button
                    onClick={logout}
                    style={{
                        background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                        border: "1px solid #a88734",
                        color: "#111", padding: "6px 14px",
                        borderRadius: "3px", cursor: "pointer",
                        fontSize: "13px", fontWeight: "600"
                    }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default Navbar;
