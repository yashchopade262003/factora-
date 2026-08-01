import { describe, it, expect } from "vitest";
import { NEXT_STATUS, canStartProduction, canCreateDispatch, canCancel, ORDER_STATUSES } from "./orderWorkflow";

describe("order workflow rules (regression guard for the dispatch/order bug)", () => {
    it("never offers a manual transition into DISPATCHED", () => {
        // DISPATCHED must only ever be set by the Dispatch Service when a
        // real Dispatch record is created. If this ever fires again, someone
        // re-introduced the "mark dispatched with nothing actually
        // dispatched" bug.
        const targets = Object.values(NEXT_STATUS);
        expect(targets).not.toContain("DISPATCHED");
    });

    it("never offers a manual transition into READY_FOR_DISPATCH", () => {
        // READY_FOR_DISPATCH must only ever be set by the Production
        // Service on production completion. A manual shortcut here would
        // let Dispatch look for finished-goods inventory that was never
        // actually produced.
        const targets = Object.values(NEXT_STATUS);
        expect(targets).not.toContain("READY_FOR_DISPATCH");
    });

    it("the only manual buyer-order status transition is DISPATCHED -> DELIVERED", () => {
        expect(NEXT_STATUS).toEqual({ DISPATCHED: "DELIVERED" });
    });

    describe("canStartProduction", () => {
        it("is true only for IN_PRODUCTION", () => {
            expect(canStartProduction("IN_PRODUCTION")).toBe(true);
            for (const status of ORDER_STATUSES.filter((s) => s !== "IN_PRODUCTION")) {
                expect(canStartProduction(status)).toBe(false);
            }
        });
    });

    describe("canCreateDispatch", () => {
        it("is true only for READY_FOR_DISPATCH", () => {
            expect(canCreateDispatch("READY_FOR_DISPATCH")).toBe(true);
            for (const status of ORDER_STATUSES.filter((s) => s !== "READY_FOR_DISPATCH")) {
                expect(canCreateDispatch(status)).toBe(false);
            }
        });
    });

    describe("canCancel", () => {
        it("is false only for terminal statuses DELIVERED and CANCELLED", () => {
            expect(canCancel("DELIVERED")).toBe(false);
            expect(canCancel("CANCELLED")).toBe(false);
            for (const status of ORDER_STATUSES.filter((s) => s !== "DELIVERED" && s !== "CANCELLED")) {
                expect(canCancel(status)).toBe(true);
            }
        });
    });

    it("every status covered by NEXT_STATUS/canStartProduction/canCreateDispatch is a real ORDER_STATUSES value", () => {
        const referenced = new Set([...Object.keys(NEXT_STATUS), ...Object.values(NEXT_STATUS)]);
        for (const status of referenced) {
            expect(ORDER_STATUSES).toContain(status);
        }
    });
});
