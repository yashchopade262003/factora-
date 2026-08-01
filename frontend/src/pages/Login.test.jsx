import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import authService from "../services/authService";

vi.mock("../services/authService", () => ({
    default: {
        login: vi.fn(),
        saveSession: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

describe("Login - single /auth/login endpoint called twice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.alert = vi.fn();
    });

    it("step 1: posts email+password with no otp, and moves to the OTP screen on status=OTP_SENT", async () => {
        authService.login.mockResolvedValue({ data: { status: "OTP_SENT" } });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await userEvent.type(document.querySelector('input[name="email"]'), "vendor@example.com");
        await userEvent.type(document.querySelector('input[name="password"]'), "secret123");
        await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

        expect(authService.login).toHaveBeenCalledWith({
            email: "vendor@example.com",
            password: "secret123",
        });
        expect(await screen.findByText("Verify OTP")).toBeInTheDocument();
    });

    it("step 2: posts email+password+otp, and saves the session + navigates on status=LOGIN_SUCCESS", async () => {
        authService.login
            .mockResolvedValueOnce({ data: { status: "OTP_SENT" } })
            .mockResolvedValueOnce({
                data: { status: "LOGIN_SUCCESS", token: "signed.jwt.token", role: "BUYER" },
            });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await userEvent.type(document.querySelector('input[name="email"]'), "vendor@example.com");
        await userEvent.type(document.querySelector('input[name="password"]'), "secret123");
        await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

        await screen.findByText("Verify OTP");
        await userEvent.type(screen.getByPlaceholderText("Enter OTP"), "482913");
        await userEvent.click(screen.getByRole("button", { name: /verify & sign in/i }));

        expect(authService.login).toHaveBeenLastCalledWith({
            email: "vendor@example.com",
            password: "secret123",
            otp: "482913",
        });
        expect(authService.saveSession).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("shows an error and stays on step 1 when credentials are wrong", async () => {
        authService.login.mockRejectedValue({ response: { data: { message: "Invalid email or password" } } });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await userEvent.type(document.querySelector('input[name="email"]'), "vendor@example.com");
        await userEvent.type(document.querySelector('input[name="password"]'), "wrongpass");
        await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

        expect(await screen.findByText("Sign In")).toBeInTheDocument();
        expect(window.alert).toHaveBeenCalledWith("Invalid email or password");
    });
});
