import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { getErrorMessage } from "../utils/apiError";

function Login() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [otp, setOtp] = useState("");

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({
                email: loginData.email,
                password: loginData.password,
            });
            if (response.data?.status !== "OTP_SENT") {
                throw new Error("Unexpected response from server.");
            }
            alert("OTP Sent Successfully.");
            setStep(2);
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Invalid Email or Password."));
        } finally {
            setLoading(false);
        }
    };

const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await authService.login({
            email: loginData.email,
            password: loginData.password,
            otp,
        });

        authService.saveSession(response);
        navigate("/dashboard");

    } catch (error) {
        console.error(error);
        alert(getErrorMessage(error, "Invalid OTP"));
    } finally {
        setLoading(false);
    }
};
    const inputStyle = {
        width: "100%", padding: "10px 12px",
        border: "1px solid #a6a6a6", borderRadius: "3px",
        marginBottom: "12px", fontSize: "14px", boxSizing: "border-box"
    };

    return (
        <div style={{ background: "#f3f3f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <header style={{ background: "#131921", padding: "12px 0", textAlign: "center" }}>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#ff9900" }}>🏭 FactoryFlow ERP</span>
            </header>
            <div style={{ height: "3px", background: "#ff9900" }} />

            {/* Card */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 0" }}>
                <div style={{
                    background: "white", border: "1px solid #ddd",
                    borderRadius: "4px", padding: "28px 32px",
                    width: "100%", maxWidth: "380px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "400", marginBottom: "20px" }}>
                        {step === 1 ? "Sign In" : "Verify OTP"}
                    </h2>

                    <form onSubmit={step === 1 ? sendOTP : verifyOTP}>
                        <label style={{ fontWeight: "bold", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                            Email
                        </label>
                        <input
                            type="email" name="email"
                            value={loginData.email} onChange={handleChange}
                            disabled={step === 2} required style={inputStyle}
                        />

                        {step === 1 && (
                            <>
                                <label style={{ fontWeight: "bold", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                    Password
                                </label>
                                <input
                                    type="password" name="password"
                                    value={loginData.password} onChange={handleChange}
                                    required style={inputStyle}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <label style={{ fontWeight: "bold", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                    OTP
                                </label>
                                <input
                                    type="text" placeholder="Enter OTP"
                                    value={otp} onChange={(e) => setOtp(e.target.value)}
                                    required style={inputStyle}
                                />
                            </>
                        )}

                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: "100%", padding: "10px",
                                background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                                border: "1px solid #a88734", borderRadius: "3px",
                                cursor: "pointer", fontSize: "14px", fontWeight: "bold",
                                color: "#111", marginTop: "4px"
                            }}
                        >
                            {loading ? "Please Wait..." : step === 1 ? "Send OTP" : "Verify & Sign In"}
                        </button>
                    </form>

                    <p style={{ fontSize: "11px", color: "#767676", margin: "16px 0 12px", textAlign: "center" }}>
                        By continuing, you agree to FactoryFlow's conditions of use.
                    </p>

                    <hr style={{ borderColor: "#e7e7e7", marginBottom: "16px" }} />

                    <p style={{ textAlign: "center", fontSize: "13px" }}>
                        New to FactoryFlow?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            style={{ color: "#007185", cursor: "pointer" }}
                        >
                            Create your account
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

export default Login;
