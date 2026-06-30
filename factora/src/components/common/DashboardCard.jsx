function DashboardCard({ title, value, color }) {
    return (
        <div style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "20px 24px",
            borderTop: `4px solid ${color}`,
            boxShadow: "0 1px 3px rgba(0,0,0,.08)"
        }}>
            <div style={{ fontSize: "12px", color: "#565959", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {title}
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: color }}>
                {value}
            </div>
        </div>
    );
}

export default DashboardCard;
