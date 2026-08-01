import { describe, it, expect, beforeEach, vi } from "vitest";
import { isVendorScoped, getSessionVendorId, fetchScoped } from "./vendorScope";

describe("vendorScope", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("isVendorScoped", () => {
        it("is true for VENDOR", () => {
            localStorage.setItem("role", "VENDOR");
            expect(isVendorScoped()).toBe(true);
        });

        it("is true for STORE_MANAGER", () => {
            localStorage.setItem("role", "STORE_MANAGER");
            expect(isVendorScoped()).toBe(true);
        });

        it("is case-insensitive", () => {
            localStorage.setItem("role", "vendor");
            expect(isVendorScoped()).toBe(true);
        });

        it("is false for ADMIN/SUPER_ADMIN and unset role", () => {
            localStorage.setItem("role", "ADMIN");
            expect(isVendorScoped()).toBe(false);

            localStorage.setItem("role", "SUPER_ADMIN");
            expect(isVendorScoped()).toBe(false);

            localStorage.removeItem("role");
            expect(isVendorScoped()).toBe(false);
        });
    });

    describe("getSessionVendorId", () => {
        it("returns the stored vendorId", () => {
            localStorage.setItem("vendorId", "101");
            expect(getSessionVendorId()).toBe("101");
        });

        it("treats the strings 'undefined'/'null' and a missing key as no vendor id", () => {
            localStorage.setItem("vendorId", "undefined");
            expect(getSessionVendorId()).toBeNull();

            localStorage.setItem("vendorId", "null");
            expect(getSessionVendorId()).toBeNull();

            localStorage.removeItem("vendorId");
            expect(getSessionVendorId()).toBeNull();
        });
    });

    describe("fetchScoped", () => {
        it("calls findByVendor for a vendor-scoped user with a vendorId on record", () => {
            localStorage.setItem("role", "VENDOR");
            localStorage.setItem("vendorId", "101");

            const getAllFn = vi.fn();
            const findByVendorFn = vi.fn();

            fetchScoped(getAllFn, findByVendorFn);

            expect(findByVendorFn).toHaveBeenCalledWith("101");
            expect(getAllFn).not.toHaveBeenCalled();
        });

        it("falls back to getAll for a vendor-scoped user with no vendorId, instead of a blank page", () => {
            localStorage.setItem("role", "VENDOR");

            const getAllFn = vi.fn();
            const findByVendorFn = vi.fn();

            fetchScoped(getAllFn, findByVendorFn);

            expect(getAllFn).toHaveBeenCalled();
            expect(findByVendorFn).not.toHaveBeenCalled();
        });

        it("calls getAll for an ADMIN regardless of vendorId", () => {
            localStorage.setItem("role", "ADMIN");
            localStorage.setItem("vendorId", "101");

            const getAllFn = vi.fn();
            const findByVendorFn = vi.fn();

            fetchScoped(getAllFn, findByVendorFn);

            expect(getAllFn).toHaveBeenCalled();
            expect(findByVendorFn).not.toHaveBeenCalled();
        });
    });
});
