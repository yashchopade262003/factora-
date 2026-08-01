// A VENDOR / STORE_MANAGER user should only ever see their own factory's
// data - never every vendor's inventory, production, dispatches, or buyer
// orders. ADMIN / SUPER_ADMIN see everything, same as before.
//
// role + vendorId are already saved to localStorage by authService.saveSession
// after login, so no extra API call is needed to make this decision.
const VENDOR_SCOPED_ROLES = ["VENDOR", "STORE_MANAGER"];

export const isVendorScoped = () => {
    const role = (localStorage.getItem("role") || "").toUpperCase();
    return VENDOR_SCOPED_ROLES.includes(role);
};

export const getSessionVendorId = () => {
    const vendorId = localStorage.getItem("vendorId");
    return vendorId && vendorId !== "undefined" && vendorId !== "null" ? vendorId : null;
};

// Given a service's `getAll` and `findByVendor` functions, calls whichever
// one is correct for the logged-in user. Falls back to getAll if a
// vendor-scoped user somehow has no vendorId on record, rather than
// showing them a blank/broken page.
export const fetchScoped = (getAllFn, findByVendorFn) => {
    const vendorId = getSessionVendorId();
    if (isVendorScoped() && vendorId) {
        return findByVendorFn(vendorId);
    }
    return getAllFn();
};
