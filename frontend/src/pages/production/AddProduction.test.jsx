import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddProduction from "./AddProduction";

vi.mock("../../services/productionService", () => ({
    default: { add: vi.fn() },
}));

const fromOrder = {
    orderId: 205,
    vendorId: 101,
    productName: "Basmati Rice",
    quantity: 500,
    unit: "Kg",
    status: "IN_PRODUCTION",
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ state: { fromOrder } }),
    };
});

describe("AddProduction pre-fill from a buyer order", () => {
    beforeEach(() => vi.clearAllMocks());

    it("shows a banner naming the order being produced for", () => {
        render(
            <MemoryRouter>
                <AddProduction />
            </MemoryRouter>
        );
        expect(screen.getByText(/Producing for Buyer Order #205/)).toBeInTheDocument();
    });

    it("pre-fills vendor, buyer order id, product name, and quantity from the order", () => {
        render(
            <MemoryRouter>
                <AddProduction />
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue("101")).toBeInTheDocument(); // vendorId
        expect(screen.getByDisplayValue("205")).toBeInTheDocument(); // buyerOrderId
        expect(screen.getByDisplayValue("Basmati Rice")).toBeInTheDocument();
        expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    });
});
