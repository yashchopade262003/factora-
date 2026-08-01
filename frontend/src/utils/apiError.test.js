import { describe, it, expect } from "vitest";
import { getErrorMessage } from "./apiError";

describe("getErrorMessage", () => {
    it("returns the fallback when there is no error at all", () => {
        expect(getErrorMessage(null, "fallback")).toBe("fallback");
    });

    it("reports unreachable server when there is no response object (network/gateway down)", () => {
        const error = { message: "Network Error" };
        expect(getErrorMessage(error)).toMatch(/unable to reach the server/i);
    });

    it("reports a timeout distinctly from a generic network failure", () => {
        const error = { code: "ECONNABORTED" };
        expect(getErrorMessage(error)).toMatch(/timed out/i);
    });

    it("returns a plain business-error message", () => {
        const error = { response: { data: { message: "Order 5 has already been dispatched." } } };
        expect(getErrorMessage(error)).toBe("Order 5 has already been dispatched.");
    });

    it("expands field-level validation errors instead of just showing 'Validation Failed'", () => {
        const error = {
            response: {
                data: {
                    message: "Validation Failed",
                    data: {
                        vendorId: "vendorId is required",
                        quantity: "quantity cannot be negative"
                    }
                }
            }
        };
        const msg = getErrorMessage(error);
        expect(msg).toContain("vendorId: vendorId is required");
        expect(msg).toContain("quantity: quantity cannot be negative");
    });

    it("falls back to a raw string response body when present", () => {
        const error = { response: { data: "Malformed request body" } };
        expect(getErrorMessage(error)).toBe("Malformed request body");
    });

    it("uses the fallback when the response body is empty/unrecognized", () => {
        const error = { response: { data: {} } };
        expect(getErrorMessage(error, "fallback")).toBe("fallback");
    });
});
