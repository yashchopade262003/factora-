// Centralized, user-friendly error message extraction.
//
// The backend's GlobalExceptionHandler returns different shapes depending on
// what went wrong:
//   - Business errors:            { message: "Buyer Order ... already dispatched." }
//   - @Valid validation errors:   { message: "Validation Failed", data: { field: "reason", ... } }
//   - Unreadable/malformed body:  { message: "Malformed request body" }
//   - Network failure / gateway down: no error.response at all
//
// Previously most pages only ever read error.response.data.message, so a
// validation failure just showed the unhelpful "Validation Failed" with no
// detail on which field was wrong. This helper unpacks the field-level
// errors too, and gives a clear message when the API can't be reached at all.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    if (!error) return fallback;

    const response = error.response;

    if (!response) {
        if (error.code === "ECONNABORTED") {
            return "The request timed out. Please check your connection and try again.";
        }
        return "Unable to reach the server. Please check your connection and try again.";
    }

    const data = response.data;

    if (data && typeof data === "object") {
        const { message, data: detail } = data;

        if (detail && typeof detail === "object" && !Array.isArray(detail)) {
            const fieldMessages = Object.entries(detail)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join("\n");
            if (fieldMessages) {
                return `${message || "Validation Failed"}\n${fieldMessages}`;
            }
        }

        if (typeof message === "string" && message.trim()) {
            return message;
        }
    }

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    return fallback;
}
