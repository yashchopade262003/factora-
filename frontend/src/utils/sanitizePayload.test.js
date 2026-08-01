import { describe, it, expect } from "vitest";
import { sanitizePayload } from "./sanitizePayload";

describe("sanitizePayload", () => {
    it("converts empty string fields to null so Jackson doesn't reject them as malformed Long/LocalDate", () => {
        const input = {
            buyerOrderId: "",
            finishedGoodsInventoryId: "",
            machineId: "",
            startDate: "",
            productName: "Rice"
        };

        expect(sanitizePayload(input)).toEqual({
            buyerOrderId: null,
            finishedGoodsInventoryId: null,
            machineId: null,
            startDate: null,
            productName: "Rice"
        });
    });

    it("converts whitespace-only strings to null", () => {
        expect(sanitizePayload({ remarks: "   " })).toEqual({ remarks: null });
    });

    it("leaves non-empty strings and numbers untouched", () => {
        const input = { vendorId: 101, productName: "Wheat Flour", quantity: 50.5 };
        expect(sanitizePayload(input)).toEqual(input);
    });

    it("recurses into nested objects", () => {
        const input = { a: { b: "", c: "keep" } };
        expect(sanitizePayload(input)).toEqual({ a: { b: null, c: "keep" } });
    });

    it("recurses into arrays", () => {
        const input = [{ x: "" }, { x: "keep" }];
        expect(sanitizePayload(input)).toEqual([{ x: null }, { x: "keep" }]);
    });

    it("leaves null, undefined, booleans, and zero untouched", () => {
        const input = { a: null, b: undefined, c: false, d: 0 };
        const result = sanitizePayload(input);
        expect(result.a).toBeNull();
        expect(result.b).toBeUndefined();
        expect(result.c).toBe(false);
        expect(result.d).toBe(0);
    });
});
