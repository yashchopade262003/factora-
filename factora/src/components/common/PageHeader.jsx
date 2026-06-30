function PageHeader({ title, subtitle }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f1111" }}>{title}</h2>
            {subtitle && (
                <p style={{ color: "#565959", fontSize: "13px", marginTop: "4px" }}>{subtitle}</p>
            )}
            <div style={{ height: "3px", background: "#ff9900", marginTop: "10px", width: "60px", borderRadius: "2px" }} />
        </div>
    );
}

export default PageHeader;
