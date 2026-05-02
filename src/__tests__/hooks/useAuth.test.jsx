import { vi, describe, test, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../../services/modules/authService", () => ({
    default: {
        login: vi.fn(),
        register: vi.fn(),
        getMe: vi.fn(),
        logout: vi.fn(),
    },
}));

import authService from "../../services/modules/authService";
import useAuth from "../../hooks/useAuth";

describe("useAuth", () => {
    beforeEach(() => vi.clearAllMocks());

    test("login — sets user state on success", async () => {
        authService.login.mockResolvedValue({
            data: { user: { id: 1, name: "Test" }, accessToken: "abc" },
        });

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.login({ email: "test@example.com", password: "pass" });
        });

        expect(result.current.user).toEqual({ id: 1, name: "Test" });
        expect(result.current.error).toBeNull();
    });

    test("login — sets error on failure", async () => {
        authService.login.mockRejectedValue({
            response: { data: { message: "Invalid credentials" } },
        });

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            try {
                await result.current.login({ email: "bad", password: "bad" });
            } catch {}
        });

        expect(result.current.error).toBe("Invalid credentials");
    });

    test("logout — clears user state", async () => {
        authService.login.mockResolvedValue({
            data: { user: { id: 1 }, accessToken: "abc" },
        });
        authService.logout.mockResolvedValue();

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.login({ email: "test@example.com", password: "pass" });
        });
        expect(result.current.user).toBeTruthy();

        await act(async () => {
            await result.current.logout();
        });
        expect(result.current.user).toBeNull();
    });

    test("register — returns response", async () => {
        authService.register.mockResolvedValue({ data: { id: 1 } });

        const { result } = renderHook(() => useAuth());

        let response;
        await act(async () => {
            response = await result.current.register({ name: "Test", email: "test@example.com", password: "pass123" });
        });

        expect(response).toEqual({ data: { id: 1 } });
    });
});
