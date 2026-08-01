// Buyer Order status workflow rules.
//
// Extracted from OrderList.jsx so the rules that caused the original
// "adding dispatch/buyer order fails" bug are unit-testable in isolation.
//
// New orders are routed automatically by the backend to either
// IN_PRODUCTION or READY_FOR_DISPATCH depending on stock (they never start
// at PENDING/CONFIRMED - see BuyerOrderService#createOrder).
//
// IN_PRODUCTION -> READY_FOR_DISPATCH is intentionally NOT offered as a
// manual button: that transition is only made automatically by the
// Production Service when a real Production Order for this item is
// started and completed (which reserves raw material and stocks the
// finished goods). A manual shortcut would flip the order forward with no
// goods actually produced, and Dispatch would then fail to find any
// finished-goods inventory for it.
//
// READY_FOR_DISPATCH -> DISPATCHED is intentionally NOT offered as a manual
// button either: it is set only by the Dispatch Service when a real
// Dispatch record is created (which deducts inventory, records
// vehicle/driver, etc). A manual shortcut would mark an order dispatched
// with no matching dispatch or inventory deduction at all.
//
// DISPATCHED -> DELIVERED stays manual because nothing else sets it: the
// Dispatch Service's own markDelivered only updates its own DeliveryStatus
// and never touches the Buyer Order.
export const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "READY_FOR_DISPATCH",
    "DISPATCHED",
    "DELIVERED",
    "CANCELLED",
];

export const statusColors = {
    PENDING: { background: "#e5a910", color: "#111" },
    CONFIRMED: { background: "#007185", color: "white" },
    IN_PRODUCTION: { background: "#8e44ad", color: "white" },
    READY_FOR_DISPATCH: { background: "#f0932b", color: "white" },
    DISPATCHED: { background: "#2e86de", color: "white" },
    DELIVERED: { background: "#067d62", color: "white" },
    CANCELLED: { background: "#b12704", color: "white" },
};

export const NEXT_STATUS = {
    DISPATCHED: "DELIVERED",
};

export const canStartProduction = (status) => status === "IN_PRODUCTION";
export const canCreateDispatch = (status) => status === "READY_FOR_DISPATCH";
export const canCancel = (status) => status !== "DELIVERED" && status !== "CANCELLED";
