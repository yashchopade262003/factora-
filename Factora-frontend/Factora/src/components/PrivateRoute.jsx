import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function PrivateRoute({ children }) {

    console.log("PrivateRoute Token:", localStorage.getItem("token"));
    console.log("Authenticated:", authService.isAuthenticated());

    if (!authService.isAuthenticated()) {
        console.log("Redirecting to Login");
        return <Navigate to="/login" replace />;
    }

    console.log("Opening Dashboard");
    return children;
}

export default PrivateRoute;