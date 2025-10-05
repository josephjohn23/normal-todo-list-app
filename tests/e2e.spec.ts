import { test, expect } from "@playwright/test";

test.describe("Login and To-Do flows", () => {
  test("logs in, manages todos, and logs out", async ({ page, context }) => {
    // Go to home (login page)
    await page.goto("/");

    // Fill credentials and login
    await page.getByLabel("Username").fill("user");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Log in" }).click();

    // Should be redirected to /protected by the client-side router
    await expect(page).toHaveURL(/\/protected$/);

    // Add a couple of todos
    const todoInput = page.getByPlaceholder("Add a new task");
    await todoInput.fill("Buy milk");
    await page.getByRole("button", { name: "Add" }).click();
    await todoInput.fill("Read a book");
    await page.getByRole("button", { name: "Add" }).click();

    // Verify both appear
    const first = page.getByText("Buy milk");
    const second = page.getByText("Read a book");
    await expect(first).toBeVisible();
    await expect(second).toBeVisible();

    // Toggle completion on first
    const firstItem = first.locator(".."); // span -> li
    await firstItem.getByRole("checkbox").check();
    await expect(first).toHaveClass(/completed/);

    // Filter: Active should show only the second
    await page.locator(".filters").getByRole("button", { name: "Active", exact: true }).click();
    await expect(second).toBeVisible();
    await expect(first).toBeHidden();

    // Filter: Completed should show only the first
    await page.locator(".filters").getByRole("button", { name: "Completed", exact: true }).click();
    await expect(first).toBeVisible();
    await expect(second).toBeHidden();

    // Back to All
    await page.locator(".filters").getByRole("button", { name: "All", exact: true }).click();

    // Delete the completed item
    await firstItem.getByRole("button", { name: "Delete" }).click();
    await expect(first).toHaveCount(0);

    // Clear completed should be disabled now (no completed left)
    await expect(page.getByRole("button", { name: "Clear Completed" })).toBeDisabled();

    // Wait for persistence to localStorage before reloading
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("protected_todos");
      if (!raw) return false;
      try {
        const data = JSON.parse(raw);
        return Array.isArray(data) && data.some((t: any) => t.text === "Read a book");
      } catch {
        return false;
      }
    });

    // Reload to confirm persistence of remaining todos
    await page.goto("/protected", { waitUntil: "networkidle" });
    const remainingItem = page.locator(".todo-item").filter({ hasText: "Read a book" });
    await expect(remainingItem).toBeVisible({ timeout: 15000 });

    // Navigate via header and logout
    await page.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");

    // Use header Logout button (middleware will then block /protected)
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/");
  });
});
