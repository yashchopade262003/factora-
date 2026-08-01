import Card from "./Card";

function FormContainer({ title, children }) {
    return (
        <Card>
            <div style={{ borderBottom: "1px solid #e7e7e7", marginBottom: "20px", paddingBottom: "12px" }}>
                <h2 style={{ fontSize: "18px", color: "#0f1111", margin: 0 }}>{title}</h2>
                <div style={{ height: "3px", background: "#ff9900", marginTop: "8px", width: "40px", borderRadius: "2px" }} />
            </div>
            {children}
        </Card>
    );
}

export default FormContainer;
