function TextArea(props) {
    return (
        <textarea
            {...props}
            style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid #a6a6a6",
                borderRadius: "3px",
                marginBottom: "14px",
                resize: "vertical",
                minHeight: "90px",
                boxSizing: "border-box",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                outline: "none"
            }}
            onFocus={e => e.target.style.borderColor = "#e77600"}
            onBlur={e => e.target.style.borderColor = "#a6a6a6"}
        />
    );
}

export default TextArea;
