function Select({ children, ...props }) {
    return (
        <select
            {...props}
            style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "3px",
                border: "1px solid #a6a6a6",
                marginBottom: "14px",
                fontSize: "14px",
                color: "#0f1111",
                background: "white",
                outline: "none"
            }}
            onFocus={e => e.target.style.borderColor = "#e77600"}
            onBlur={e => e.target.style.borderColor = "#a6a6a6"}
        >
            {children}
        </select>
    );
}

export default Select;
