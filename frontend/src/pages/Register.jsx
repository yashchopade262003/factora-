import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import roleService from "../services/roleService";
import vendorService from "../services/vendorService";
import { getErrorMessage } from "../utils/apiError";

function Register() {
    const navigate = useNavigate();
    const [isNewFactory, setIsNewFactory] = useState(false);
    const [user, setUser] = useState({
        username: "", email: "", password: "",
        phone: "", status: "ACTIVE", vendorId: "", roleId: ""
    });
    const [newVendor, setNewVendor] = useState({
        vendorCode: "", vendorName: "", factoryName: "",
        ownerName: "", email: "", phone: "", address: "", gstNumber: "", status: "ACTIVE"
    });
    const [vendors, setVendors] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            vendorService.getAllVendors().catch(() => ({ data: [] })),
            roleService.getAllRoles().catch(() => ({ data: [] }))
        ]).then(([vendorsRes, rolesRes]) => {
            setVendors(vendorsRes.data || []);
            setRoles(rolesRes.data || []);
        }).finally(() => setLoadingOptions(false));
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleVendorChange = (e) => {
        setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let vendorId = user.vendorId;

            // Setting up a brand-new factory: create the vendor first, then
            // link the new user to the vendor id the backend just assigned.
            // (Requires the backend fix that restores VendorDTO.vendorId -
            // without it, vendorId comes back undefined and this will fail.)
            if (isNewFactory) {
                const vendorRes = await vendorService.addVendor({
                    ...newVendor,
                    email: newVendor.email || user.email,
                    phone: newVendor.phone || user.phone
                });
                vendorId = vendorRes.data?.vendorId;
                if (!vendorId) {
                    throw new Error("Vendor was created but no vendor id came back from the server. Make sure the backend fix restoring VendorDTO.vendorId is deployed.");
                }
            }

            await authService.register({
                ...user,
                vendorId: Number(vendorId),
                roleId: Number(user.roleId)
            });
            alert(isNewFactory ? "Your factory and admin account were created!" : "Registration Successful");
            setUser({ username: "", email: "", password: "", phone: "", status: "ACTIVE", vendorId: "", roleId: "" });
            navigate("/login");
        } catch (error) {
            console.log(error);
            alert(getErrorMessage(error, "Registration Failed"));
        } finally {
            setSaving(false);
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
                    width: "100%", maxWidth: isNewFactory ? "460px" : "400px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "400", marginBottom: "8px" }}>Create Account</h2>

                    <div style={{ display: "flex", gap: "8px", marginBottom: "18px", background: "#f3f3f3", padding: "4px", borderRadius: "4px" }}>
                        <button
                            type="button"
                            onClick={() => setIsNewFactory(false)}
                            style={{
                                flex: 1, padding: "8px", borderRadius: "3px", border: "none", cursor: "pointer",
                                fontSize: "12px", fontWeight: "600",
                                background: !isNewFactory ? "white" : "transparent",
                                boxShadow: !isNewFactory ? "0 1px 3px rgba(0,0,0,.15)" : "none",
                                color: !isNewFactory ? "#0f1111" : "#565959"
                            }}
                        >
                            Join an existing vendor
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsNewFactory(true)}
                            style={{
                                flex: 1, padding: "8px", borderRadius: "3px", border: "none", cursor: "pointer",
                                fontSize: "12px", fontWeight: "600",
                                background: isNewFactory ? "white" : "transparent",
                                boxShadow: isNewFactory ? "0 1px 3px rgba(0,0,0,.15)" : "none",
                                color: isNewFactory ? "#0f1111" : "#565959"
                            }}
                        >
                            Set up a new factory
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>Your name</label>
                        <input type="text" name="username" placeholder="Full name" value={user.username} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Email</label>
                        <input type="email" name="email" placeholder="Email address" value={user.email} onChange={handleChange} required style={inputStyle} />

                        <label style={labelStyle}>Password</label>
                        <input type="password" name="password" placeholder="At least 6 characters" value={user.password} onChange={handleChange} required minLength={6} style={inputStyle} />

                        <label style={labelStyle}>Mobile number</label>
                        <input type="text" name="phone" placeholder="Phone number" value={user.phone} onChange={handleChange} required style={inputStyle} />

                        {isNewFactory ? (
                            <>
                                <div style={{ height: "1px", background: "#e7e7e7", margin: "16px 0" }} />
                                <p style={{ fontSize: "12px", color: "#565959", marginBottom: "12px" }}>
                                    Tell us about your factory. This creates a new vendor account and you'll be its first admin.
                                </p>

                                <label style={labelStyle}>Vendor / company code</label>
                                <input type="text" name="vendorCode" placeholder="e.g. RICE-001" value={newVendor.vendorCode} onChange={handleVendorChange} required style={inputStyle} />

                                <label style={labelStyle}>Vendor / company name</label>
                                <input type="text" name="vendorName" placeholder="e.g. Sharma Rice Mills" value={newVendor.vendorName} onChange={handleVendorChange} required style={inputStyle} />

                                <label style={labelStyle}>Factory name</label>
                                <input type="text" name="factoryName" placeholder="Factory / unit name" value={newVendor.factoryName} onChange={handleVendorChange} required style={inputStyle} />

                                <label style={labelStyle}>Owner name</label>
                                <input type="text" name="ownerName" placeholder="Owner's full name" value={newVendor.ownerName} onChange={handleVendorChange} required style={inputStyle} />

                                <label style={labelStyle}>Factory address</label>
                                <input type="text" name="address" placeholder="Factory address" value={newVendor.address} onChange={handleVendorChange} required style={inputStyle} />

                                <label style={labelStyle}>GST number</label>
                                <input type="text" name="gstNumber" placeholder="GST number" value={newVendor.gstNumber} onChange={handleVendorChange} required style={inputStyle} />

                                <div style={{ height: "1px", background: "#e7e7e7", margin: "16px 0" }} />
                            </>
                        ) : (
                            <>
                                <label style={labelStyle}>Vendor</label>
                                <select name="vendorId" value={user.vendorId} onChange={handleChange} required style={inputStyle} disabled={loadingOptions}>
                                    <option value="">{loadingOptions ? "Loading vendors..." : "Select your vendor"}</option>
                                    {vendors.map((v) => (
                                        <option key={v.vendorId} value={v.vendorId}>{v.vendorName}</option>
                                    ))}
                                </select>
                                {!loadingOptions && vendors.length === 0 && (
                                    <p style={{ fontSize: "11px", color: "#b12704", marginTop: "-8px", marginBottom: "12px" }}>
                                        No vendors exist yet.{" "}
                                        <span onClick={() => setIsNewFactory(true)} style={{ color: "#007185", cursor: "pointer", textDecoration: "underline" }}>
                                            Set up the first one
                                        </span>.
                                    </p>
                                )}
                            </>
                        )}

                        <label style={labelStyle}>Role</label>
                        <select name="roleId" value={user.roleId} onChange={handleChange} required style={inputStyle} disabled={loadingOptions}>
                            <option value="">{loadingOptions ? "Loading roles..." : "Select your role"}</option>
                            {roles.map((r) => (
                                <option key={r.roleId} value={r.roleId}>{r.roleName}</option>
                            ))}
                        </select>
                        {!loadingOptions && roles.length === 0 && (
                            <p style={{ fontSize: "11px", color: "#b12704", marginTop: "-8px", marginBottom: "12px" }}>
                                No roles exist yet - ask an admin to add one first.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                width: "100%", padding: "10px",
                                background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                                border: "1px solid #a88734", borderRadius: "3px",
                                cursor: "pointer", fontSize: "14px", fontWeight: "bold", color: "#111"
                            }}
                        >
                            {saving ? "Creating..." : (isNewFactory ? "Create factory & admin account" : "Create your FactoryFlow account")}
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
