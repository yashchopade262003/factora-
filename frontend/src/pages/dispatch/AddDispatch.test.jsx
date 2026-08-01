import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddDispatch from "./AddDispatch";

vi.mock("../../services/dispatchService", () => ({
    default: { add: vi.fn() },
}));

const fromOrder = {
    orderId: 205,
    vendorId: 101,
    buyerId: 102,
    productName: "Basmati Rice",
    quantity: 500,
    unit: "Kg",
    expectedDeliveryDate: "2026-08-15",
    status: "READY_FOR_DISPATCH",
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ state: { fromOrder } }),
    };
});

describe("AddDispatch pre-fill from a buyer order", () => {
    beforeEach(() => vi.clearAllMocks());

    it("shows a banner naming the order being fulfilled", () => {
        render(
            <MemoryRouter>
                <AddDispatch />
            </MemoryRouter>
        );
        expect(screen.getByText(/Fulfilling Buyer Order #205/)).toBeInTheDocument();
    });

    it("pre-fills vendor, buyer, order id, product, quantity, and delivery date from the order", () => {
        render(
            <MemoryRouter>
                <AddDispatch />
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue("101")).toBeInTheDocument(); // vendorId
        expect(screen.getByDisplayValue("102")).toBeInTheDocument(); // buyerId
        expect(screen.getByDisplayValue("205")).toBeInTheDocument(); // buyerOrderId
        expect(screen.getByDisplayValue("Basmati Rice")).toBeInTheDocument();
        expect(screen.getByDisplayValue("500")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2026-08-15")).toBeInTheDocument();
    });
});
