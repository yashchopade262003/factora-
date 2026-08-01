import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditOrder from "./EditOrder";
import buyerService from "../../services/buyerService";
import { ORDER_STATUSES } from "./orderWorkflow";

vi.mock("../../services/buyerService", () => ({
    default: {
        getOrderById: vi.fn(),
        updateOrder: vi.fn(),
    },
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => vi.fn(), useParams: () => ({ id: "101" }) };
});

describe("EditOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        buyerService.getOrderById.mockResolvedValue({
            data: {
                data: {
                    vendorId: 101,
                    buyerId: 101,
                    productName: "Basmati Rice",
                    quantity: 500,
                    unit: "Kg",
                    unitPrice: 40,
                    expectedDeliveryDate: "2026-08-01",
                    status: "READY_FOR_DISPATCH",
                },
            },
        });
    });

    it("renders every valid OrderStatus as a dropdown option, so saving never silently downgrades the status", async () => {
        render(
            <MemoryRouter>
                <EditOrder />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Edit Buyer Order")).toBeInTheDocument());

        const options = screen.getAllByRole("option").map((o) => o.textContent);
        for (const status of ORDER_STATUSES) {
            expect(options).toContain(status);
        }
        expect(options).toHaveLength(ORDER_STATUSES.length);
    });

    it("pre-selects the order's current status (READY_FOR_DISPATCH) instead of defaulting to the first option", async () => {
        render(
            <MemoryRouter>
                <EditOrder />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Edit Buyer Order")).toBeInTheDocument());
        const select = screen.getByDisplayValue("READY_FOR_DISPATCH");
        expect(select).toBeInTheDocument();
    });
});
