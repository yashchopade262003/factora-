function DataTable({ columns, data }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                    <tr style={{ background: "#232f3e", color: "white" }}>
                        {columns.map((column) => (
                            <th key={column.key} style={{
                                padding: "10px 14px",
                                textAlign: "left",
                                fontWeight: "600",
                                fontSize: "12px",
                                letterSpacing: "0.3px"
                            }}>
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: "center", padding: "30px", color: "#767676" }}>
                                No Records Found
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index} style={{ background: index % 2 === 0 ? "white" : "#f9f9f9" }}>
                                {columns.map((column) => (
                                    <td key={column.key} style={{
                                        padding: "10px 14px",
                                        borderBottom: "1px solid #e7e7e7",
                                        color: "#0f1111"
                                    }}>
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
