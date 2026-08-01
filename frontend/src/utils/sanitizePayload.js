// Many "Add"/"Edit" forms keep optional numeric or date fields (buyerOrderId,
// finishedGoodsInventoryId, machineId, startDate, endDate, etc.) in React
// state as an empty string ("") when the user leaves them blank, since HTML
// inputs always work with strings.
//
// The backend DTOs declare these same fields as Long / LocalDate. When the
// frontend serializes formData straight into JSON, an empty string like
// `"buyerOrderId": ""` gets sent instead of leaving the field out entirely.
// Jackson cannot coerce "" into a Long or a LocalDate, so the request blows
// up with a generic 400 "Malformed request body" error - this is the root
// cause of the "error occurs when I try to add the dispatch" bug (and the
// same bug is reproducible on Production, Buyer Order, and other forms that
// share this pattern).
//
// Fixing it once here - centrally, in the axios request interceptor - means
// every form in the app is protected, instead of hunting down each page.
export function sanitizePayload(value) {
    if (Array.isArray(value)) {
        return value.map(sanitizePayload);
    }

    if (value !== null && typeof value === "object") {
        const cleaned = {};
        for (const [key, val] of Object.entries(value)) {
            cleaned[key] = sanitizePayload(val);
        }
        return cleaned;
    }

    if (typeof value === "string" && value.trim() === "") {
        return null;
    }

    return value;
}
