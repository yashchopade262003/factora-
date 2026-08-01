function Label({ children }) {
    return (
        <label style={{
            fontWeight: "bold",
            fontSize: "13px",
            display: "block",
            marginBottom: "5px",
            color: "#0f1111"
        }}>
            {children}
        </label>
    );
}

export default Label;
