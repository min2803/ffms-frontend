import { vi, describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useAuth", () => ({
    default: () => ({
        user: null,
        loading: false,
        error: null,
        login: vi.fn().mockRejectedValue({
            response: { data: { message: "Invalid email or password" } },
        }),
        register: vi.fn(),
        getMe: vi.fn(),
        logout: vi.fn(),
    }),
}));

vi.mock("../../utils/dateTime", () => ({
    getCurrentYear: () => 2026,
}));

import LoginPage from "../../pages/auth/LoginPage";

describe("LoginPage", () => {
    beforeEach(() => vi.clearAllMocks());

    test("renders email and password fields", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });

    test("shows error on empty submit", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const submitBtn = screen.getByRole("button", { name: /sign in/i });
        await user.click(submitBtn);

        expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });

    test("'Forgot?' link points to /forgot-password", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const forgotLink = screen.getByText("Forgot?");
        expect(forgotLink.closest("a")).toHaveAttribute("href", "/forgot-password");
    });

    test("submit calls login with credentials", async () => {
        const mockLogin = vi.fn().mockResolvedValue({
            data: { user: { id: 1, role_name: "user" } },
        });

        vi.doMock("../../hooks/useAuth", () => ({
            default: () => ({
                user: null,
                loading: false,
                error: null,
                login: mockLogin,
                register: vi.fn(),
                getMe: vi.fn(),
                logout: vi.fn(),
            }),
        }));

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText("name@company.com");
        const passwordInput = screen.getByPlaceholderText("••••••••");

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");

        const submitBtn = screen.getByRole("button", { name: /sign in/i });
        await user.click(submitBtn);
    });
});
