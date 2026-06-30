function Card({ children }) {
    return (
        <div style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,.08)"
        }}>
            {children}
        </div>
    );
}

export default Card;
