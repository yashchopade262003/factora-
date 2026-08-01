function ActionButtons({ onView, onEdit, onDelete }) {
    return (
        <div style={{ display: "flex", gap: "6px" }}>
            {onView && (
                <button onClick={onView} style={{
                    background: "linear-gradient(to bottom, #f0c040, #e5a910)",
                    border: "1px solid #a88734", borderRadius: "3px",
                    padding: "4px 10px", cursor: "pointer",
                    fontSize: "12px", fontWeight: "600", color: "#111"
                }}>
                    View
                </button>
            )}
            {onEdit && (
                <button onClick={onEdit} style={{
                    background: "linear-gradient(to bottom, #f7f8fa, #e7e9ec)",
                    border: "1px solid #adb1b8", borderRadius: "3px",
                    padding: "4px 10px", cursor: "pointer",
                    fontSize: "12px", color: "#0f1111"
                }}>
                    Edit
                </button>
            )}
            {onDelete && (
                <button onClick={onDelete} style={{
                    background: "linear-gradient(to bottom, #f7f8fa, #e7e9ec)",
                    border: "1px solid #adb1b8", borderRadius: "3px",
                    padding: "4px 10px", cursor: "pointer",
                    fontSize: "12px", color: "#b12704"
                }}>
                    Delete
                </button>
            )}
        </div>
    );
}

export default ActionButtons;
