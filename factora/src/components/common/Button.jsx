function Button({
    children,
    type = "button",
    onClick,
    color = "#e5a910",
    textColor = "#111"
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                background: color === "#e5a910"
                    ? "linear-gradient(to bottom, #f0c040, #e5a910)"
                    : color,
                color: color === "#e5a910" ? "#111" : textColor,
                border: color === "#e5a910" ? "1px solid #a88734" : "1px solid transparent",
                padding: "8px 16px",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600"
            }}
        >
            {children}
        </button>
    );
}

export default Button;
