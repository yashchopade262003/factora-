import { useLocation, Link } from "react-router-dom";

function Breadcrumb() {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    return (
        <div style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "9px 16px",
            borderRadius: "3px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#565959"
        }}>
            {paths.map((path, index) => (
                <span key={index}>
                    <span style={{
                        color: index === paths.length - 1 ? "#0f1111" : "#007185",
                        fontWeight: index === paths.length - 1 ? "bold" : "normal",
                        textTransform: "capitalize"
                    }}>
                        {path}
                    </span>
                    {index !== paths.length - 1 && (
                        <span style={{ margin: "0 6px", color: "#aaa" }}>›</span>
                    )}
                </span>
            ))}
        </div>
    );
}

export default Breadcrumb;
