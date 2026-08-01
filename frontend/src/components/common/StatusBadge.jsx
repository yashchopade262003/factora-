function StatusBadge({ status }) {
    const getStyle = () => {
        switch (status) {
            case "ACTIVE":   return { background: "#067d62", color: "white" };
            case "INACTIVE": return { background: "#b12704", color: "white" };
            case "PENDING":  return { background: "#e5a910", color: "#111" };
            default:         return { background: "#767676", color: "white" };
        }
    };

    return (
        <span style={{
            ...getStyle(),
            padding: "3px 10px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.4px"
        }}>
            {status}
        </span>
    );
}

export default StatusBadge;
