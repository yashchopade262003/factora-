import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { getErrorMessage } from "../utils/apiError";

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

            const response = await authService.verifyOtp({
                email: email,
                otp: otp
            });

            authService.saveSession(response);

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(getErrorMessage(error, "Invalid OTP"));

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