import { vi, describe, test, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/modules/authService", () => ({
    default: {
        forgotPassword: vi.fn(),
        resetPassword: vi.fn(),
    },
}));

import authService from "../../services/modules/authService";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";

describe("ForgotPasswordPage", () => {
    beforeEach(() => vi.clearAllMocks());

    test("renders email form initially", () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
        expect(screen.getByText("Get Reset Token")).toBeInTheDocument();
    });

    test("transitions to step 2 after submit", async () => {
        authService.forgotPassword.mockResolvedValue({
            data: { resetToken: "token123" },
        });

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        await user.type(screen.getByPlaceholderText("name@company.com"), "test@example.com");
        await user.click(screen.getByText("Get Reset Token"));

        await waitFor(() => {
            expect(screen.getByPlaceholderText("Paste the reset token here")).toBeInTheDocument();
        });
    });

    test("shows success on step 3", async () => {
        authService.forgotPassword.mockResolvedValue({
            data: { resetToken: "token123" },
        });
        authService.resetPassword.mockResolvedValue({
            message: "Password reset successfully",
        });

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        await user.type(screen.getByPlaceholderText("name@company.com"), "test@example.com");
        await user.click(screen.getByText("Get Reset Token"));

        await waitFor(() => {
            expect(screen.getByPlaceholderText("Paste the reset token here")).toBeInTheDocument();
        });

        const passwordFields = screen.getAllByPlaceholderText("••••••••");
        await user.type(passwordFields[0], "newpassword123");
        await user.type(passwordFields[1], "newpassword123");
        await user.click(screen.getByRole("button", { name: /reset password/i }));

        await waitFor(() => {
            expect(screen.getByText(/password reset successfully/i)).toBeInTheDocument();
        });
    });
});
