import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import OrderList from "./OrderList";
import buyerService from "../../services/buyerService";

vi.mock("../../services/buyerService", () => ({
    default: {
        getAllOrders: vi.fn(),
        findOrdersByVendor: vi.fn(),
        removeOrder: vi.fn(),
        updateOrderStatus: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

const baseOrder = {
    orderId: 101,
    productName: "Basmati Rice",
    quantity: 500,
    unit: "Kg",
    unitPrice: 40,
    totalAmount: 20000,
    vendorId: 101,
    buyerId: 101,
};

function setOrders(orders) {
    buyerService.getAllOrders.mockResolvedValue({ data: { data: orders } });
}

function renderOrderList() {
    return render(
        <MemoryRouter>
            <OrderList />
        </MemoryRouter>
    );
}

describe("OrderList - status-driven actions (regression guard)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("offers 'Start Production' - and never a manual dispatch/delivery shortcut - for an IN_PRODUCTION order", async () => {
        setOrders([{ ...baseOrder, status: "IN_PRODUCTION" }]);
        renderOrderList();

        await waitFor(() => expect(screen.getByText("Start Production")).toBeInTheDocument());
        expect(screen.queryByText("Create Dispatch")).not.toBeInTheDocument();
        expect(screen.queryByText(/Move to/)).not.toBeInTheDocument();
    });

    it("offers 'Create Dispatch' - and no manual DISPATCHED shortcut - for a READY_FOR_DISPATCH order", async () => {
        setOrders([{ ...baseOrder, status: "READY_FOR_DISPATCH" }]);
        renderOrderList();

        await waitFor(() => expect(screen.getByText("Create Dispatch")).toBeInTheDocument());
        expect(screen.queryByText("Start Production")).not.toBeInTheDocument();
        expect(screen.queryByText(/Move to/)).not.toBeInTheDocument();
    });

    it("only offers 'Move to DELIVERED' for a DISPATCHED order", async () => {
        setOrders([{ ...baseOrder, status: "DISPATCHED" }]);
        renderOrderList();

        await waitFor(() => expect(screen.getByText("Move to DELIVERED")).toBeInTheDocument());
        expect(screen.queryByText("Start Production")).not.toBeInTheDocument();
        expect(screen.queryByText("Create Dispatch")).not.toBeInTheDocument();
    });

    it("offers no forward action and no Cancel for a DELIVERED order", async () => {
        setOrders([{ ...baseOrder, status: "DELIVERED" }]);
        renderOrderList();

        await waitFor(() => expect(screen.getByText("Basmati Rice")).toBeInTheDocument());
        expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
        expect(screen.queryByText(/Move to/)).not.toBeInTheDocument();
    });

    it("navigates to Add Dispatch pre-filled with the order when 'Create Dispatch' is clicked", async () => {
        const order = { ...baseOrder, status: "READY_FOR_DISPATCH" };
        setOrders([order]);
        renderOrderList();

        const btn = await screen.findByText("Create Dispatch");
        await userEvent.click(btn);

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard/dispatch/add", { state: { fromOrder: order } });
    });

    it("navigates to Add Production pre-filled with the order when 'Start Production' is clicked", async () => {
        const order = { ...baseOrder, status: "IN_PRODUCTION" };
        setOrders([order]);
        renderOrderList();

        const btn = await screen.findByText("Start Production");
        await userEvent.click(btn);

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard/production/add", { state: { fromOrder: order } });
    });

    it("shows an error banner instead of crashing when the buyer service is offline", async () => {
        buyerService.getAllOrders.mockRejectedValue(new Error("network down"));
        renderOrderList();

        await waitFor(() =>
            expect(screen.getByText(/Unable to load buyer orders/i)).toBeInTheDocument()
        );
    });
});
