import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const modules = [
        { title: "📦 Inventory", desc: "Manage Raw Materials & Finished Goods" },
        { title: "🏬 Warehouse", desc: "Warehouse & Stock Transfer" },
        { title: "🏭 Production", desc: "Production Planning & Monitoring" },
        { title: "🚚 Suppliers", desc: "Supplier Management" },
        { title: "🛒 Buyers", desc: "Buyer & Customer Management" },
        { title: "📤 Dispatch", desc: "Shipment & Delivery Tracking" },
    ];

    const features = [
        "JWT Authentication", "Email OTP Verification",
        "Microservice Architecture", "API Gateway",
        "Inventory Tracking", "Warehouse Management",
        "Vendor Management", "Supplier Management",
        "Buyer Management", "Reports & Analytics"
    ];

    return (
        <div style={{ fontFamily: "Arial, sans-serif", background: "#f3f3f3", minHeight: "100vh" }}>

            {/* Amazon-style top bar */}
            <header style={{ background: "#131921", color: "white", padding: "0 20px" }}>
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", maxWidth: "1200px",
                    margin: "0 auto", height: "60px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "24px" }}>🏭</span>
                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "#ff9900" }}>
                            FactoryFlow
                        </span>
                        <span style={{ fontSize: "13px", color: "#ccc", marginLeft: "4px" }}>ERP</span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                background: "transparent", border: "1px solid #aaa",
                                color: "white", padding: "7px 16px",
                                borderRadius: "3px", cursor: "pointer", fontSize: "13px"
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            style={{
                                background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                                border: "1px solid #a88734",
                                color: "#111", padding: "7px 16px",
                                borderRadius: "3px", cursor: "pointer", fontSize: "13px", fontWeight: "600"
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Orange accent bar */}
            <div style={{ height: "3px", background: "#ff9900" }} />

            {/* Nav bar */}
            <div style={{ background: "#232f3e", color: "white", padding: "8px 0" }}>
                <div style={{
                    maxWidth: "1200px", margin: "0 auto",
                    padding: "0 20px", display: "flex", gap: "20px", fontSize: "13px"
                }}>
                    {["Inventory", "Warehouse", "Production", "Suppliers", "Buyers", "Dispatch"].map(item => (
                        <span key={item} style={{ cursor: "pointer", padding: "4px 6px" }}
                            onMouseEnter={e => e.target.style.outline = "1px solid white"}
                            onMouseLeave={e => e.target.style.outline = "none"}
                        >{item}</span>
                    ))}
                </div>
            </div>

            {/* Hero */}
            <div style={{
                background: "linear-gradient(135deg, #1a2a3a, #232f3e)",
                color: "white", padding: "60px 20px", textAlign: "center"
            }}>
                <h1 style={{ fontSize: "36px", marginBottom: "16px", fontWeight: "300" }}>
                    Multi Vendor Factory Management System
                </h1>
                <p style={{ color: "#ccc", fontSize: "16px", marginBottom: "30px", maxWidth: "600px", margin: "0 auto 30px" }}>
                    Complete ERP Solution for Inventory, Production, Warehouse, Suppliers, Buyers and Dispatch.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                            border: "1px solid #a88734",
                            color: "#111", padding: "12px 28px",
                            borderRadius: "3px", cursor: "pointer",
                            fontSize: "15px", fontWeight: "bold"
                        }}
                    >
                        Get Started Free
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            background: "transparent",
                            border: "1px solid #ddd",
                            color: "white", padding: "12px 28px",
                            borderRadius: "3px", cursor: "pointer", fontSize: "15px"
                        }}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* Modules */}
            <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px" }}>
                <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "#0f1111", borderBottom: "2px solid #ff9900", paddingBottom: "8px", display: "inline-block" }}>
                    FactoryFlow Modules
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                    {modules.map((m, i) => (
                        <div key={i} style={{
                            background: "white", border: "1px solid #ddd",
                            borderRadius: "4px", padding: "20px",
                            boxShadow: "0 1px 3px rgba(0,0,0,.08)"
                        }}>
                            <h3 style={{ fontSize: "16px", marginBottom: "8px", color: "#0f1111" }}>{m.title}</h3>
                            <p style={{ color: "#565959", fontSize: "13px" }}>{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div style={{ maxWidth: "1200px", margin: "20px auto 40px", padding: "0 20px" }}>
                <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "4px", padding: "24px" }}>
                    <h2 style={{ fontSize: "18px", marginBottom: "16px", borderBottom: "2px solid #ff9900", paddingBottom: "8px", display: "inline-block" }}>
                        Key Features
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
                        {features.map((f, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                                <span style={{ color: "#ff9900", fontWeight: "bold" }}>✓</span>
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: "#131921", color: "#ccc", textAlign: "center", padding: "30px 20px" }}>
                <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#ff9900", fontWeight: "bold" }}>FactoryFlow ERP</span>
                </div>
                <p style={{ fontSize: "12px" }}>© 2026 FactoryFlow ERP. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
