import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../../services/api/axiosClient", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

import axiosClient from "../../services/api/axiosClient";
import categoryService from "../../services/modules/categoryService";

describe("categoryService", () => {
    beforeEach(() => vi.clearAllMocks());

    test("getCategories — GET /categories", async () => {
        axiosClient.get.mockResolvedValue({ data: [] });
        await categoryService.getCategories();
        expect(axiosClient.get).toHaveBeenCalledWith("/categories", { params: {} });
    });

    test("getCategoryById — GET /categories/:id", async () => {
        axiosClient.get.mockResolvedValue({ data: { id: 1 } });
        await categoryService.getCategoryById(1);
        expect(axiosClient.get).toHaveBeenCalledWith("/categories/1");
    });

    test("createCategory — POST /categories", async () => {
        axiosClient.post.mockResolvedValue({ data: { id: 1 } });
        await categoryService.createCategory({ name: "Food", type: "expense" });
        expect(axiosClient.post).toHaveBeenCalledWith("/categories", { name: "Food", type: "expense" });
    });

    test("updateCategory — PUT /categories/:id", async () => {
        axiosClient.put.mockResolvedValue({ data: { id: 1 } });
        await categoryService.updateCategory(1, { name: "Updated" });
        expect(axiosClient.put).toHaveBeenCalledWith("/categories/1", { name: "Updated" });
    });

    test("deleteCategory — DELETE /categories/:id", async () => {
        axiosClient.delete.mockResolvedValue({});
        await categoryService.deleteCategory(1);
        expect(axiosClient.delete).toHaveBeenCalledWith("/categories/1");
    });
});
