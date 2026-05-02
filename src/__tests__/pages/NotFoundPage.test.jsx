import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "../../pages/auth/NotFoundPage";

describe("NotFoundPage", () => {
    test("renders 404 and 'Page not found'", () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText("Page not found")).toBeInTheDocument();
    });

    test("'Back to Home' link points to /", () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        const link = screen.getByText("Back to Home");
        expect(link.closest("a")).toHaveAttribute("href", "/");
    });
});
