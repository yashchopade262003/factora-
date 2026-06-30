import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function VerifyOtp() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await authService.verifyOtp({
                email: email,
                otp: otp
            });

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Invalid OTP"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div>

            <h2>Verify OTP</h2>

            <p>Email : {email}</p>

            <form onSubmit={handleVerify}>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">

                    {
                        loading
                            ? "Verifying..."
                            : "Verify OTP"
                    }

                </button>

            </form>

        </div>

    );

}

export default VerifyOtp;