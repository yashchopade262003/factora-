import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "", email: "", password: "",
        phone: "", status: "ACTIVE", vendorId: "", roleId: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(user);
            alert("Registration Successful");
            setUser({ username: "", email: "", password: "", phone: "", status: "ACTIVE", vendorId: "", roleId: "" });
            navigate("/login");
        } catch (error) {
            console.log(error);
            alert("Registration Failed");
        }
    };

    const inputStyle = {
        width: "100%", padding: "10px 12px",
        border: "1px solid #a6a6a6", borderRadius: "3px",
        marginBottom: "12px", fontSize: "14px", boxSizing: "border-box"
    };
    const labelStyle = { fontWeight: "bold", fontSize: "13px", display: "block", marginBottom: "4px" };

    return (
        <div style={{ background: "#f3f3f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ background: "#131921", padding: "12px 0", textAlign: "center" }}>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#ff9900" }}>🏭 FactoryFlow ERP</span>
            </header>
            <div style={{ height: "3px", background: "#ff9900" }} />

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 0" }}>
                <div style={{
                    background: "white", border: "1px solid #ddd",
                    borderRadius: "4px", padding: "28px 32px",
                    width: "100%", maxWidth: "400px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "400", marginBottom: "20px" }}>Create Account</h2>

                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>Your name</label>
                        <input type="text" name="username" placeholder="Full name" value={user.username} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Email</label>
                        <input type="email" name="email" placeholder="Email address" value={user.email} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Password</label>
                        <input type="password" name="password" placeholder="At least 6 characters" value={user.password} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Mobile number</label>
                        <input type="text" name="phone" placeholder="Phone number" value={user.phone} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Vendor ID</label>
                        <input type="number" name="vendorId" placeholder="Vendor ID" value={user.vendorId} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Role ID</label>
                        <input type="number" name="roleId" placeholder="Role ID" value={user.roleId} onChange={handleChange} required style={inputStyle} />

                        <button
                            type="submit"
                            style={{
                                width: "100%", padding: "10px",
                                background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                                border: "1px solid #a88734", borderRadius: "3px",
                                cursor: "pointer", fontSize: "14px", fontWeight: "bold", color: "#111"
                            }}
                        >
                            Create your FactoryFlow account
                        </button>
                    </form>

                    <p style={{ fontSize: "11px", color: "#767676", margin: "14px 0 12px" }}>
                        By creating an account, you agree to FactoryFlow's Conditions of Use.
                    </p>
                    <hr style={{ borderColor: "#e7e7e7", marginBottom: "12px" }} />
                    <p style={{ textAlign: "center", fontSize: "13px" }}>
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")} style={{ color: "#007185", cursor: "pointer" }}>
                            Sign in
                        </span>
                    </p>
                </div>
            </div>

            <footer style={{ background: "#131921", color: "#999", textAlign: "center", padding: "16px", fontSize: "12px" }}>
                © 2026 FactoryFlow ERP
            </footer>
        </div>
    );
}

export default Register;
