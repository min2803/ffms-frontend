import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../../services/api/axiosClient", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

import axiosClient from "../../services/api/axiosClient";
import authService from "../../services/modules/authService";

describe("authService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("login — calls POST /auth/login and stores tokens", async () => {
        axiosClient.post.mockResolvedValue({
            data: {
                user: { id: 1, role_name: "user" },
                accessToken: "access123",
                refreshToken: "refresh123",
            },
        });

        const res = await authService.login({ email: "test@example.com", password: "pass" });
        expect(axiosClient.post).toHaveBeenCalledWith("/auth/login", { email: "test@example.com", password: "pass" });
        expect(localStorage.getItem("accessToken")).toBe("access123");
        expect(localStorage.getItem("refreshToken")).toBe("refresh123");
    });

    test("logout — calls POST /auth/logout and clears localStorage", async () => {
        localStorage.setItem("accessToken", "token");
        localStorage.setItem("refreshToken", "refresh");
        localStorage.setItem("userRole", "user");
        axiosClient.post.mockResolvedValue({});

        await authService.logout();
        expect(localStorage.getItem("accessToken")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
        expect(localStorage.getItem("userRole")).toBeNull();
    });

    test("register — calls POST /auth/register", async () => {
        axiosClient.post.mockResolvedValue({ data: { id: 1 } });
        await authService.register({ name: "Test", email: "test@example.com", password: "pass123" });
        expect(axiosClient.post).toHaveBeenCalledWith("/auth/register", expect.any(Object));
    });

    test("forgotPassword — calls POST /auth/forgot-password", async () => {
        axiosClient.post.mockResolvedValue({ resetToken: "token" });
        await authService.forgotPassword("test@example.com");
        expect(axiosClient.post).toHaveBeenCalledWith("/auth/forgot-password", { email: "test@example.com" });
    });

    test("resetPassword — calls POST /auth/reset-password", async () => {
        axiosClient.post.mockResolvedValue({ message: "ok" });
        await authService.resetPassword("token123", "newpass");
        expect(axiosClient.post).toHaveBeenCalledWith("/auth/reset-password", { token: "token123", newPassword: "newpass" });
    });
});
