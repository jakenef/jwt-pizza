import { test, expect } from "playwright-test-coverage";
import { adminInit } from "./utils";

test("admin can create a franchise", async ({ page }) => {
  await adminInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("admin@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("adminpass");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: /admin/i }).click();

  // Click add franchise
  await page.getByRole("button", { name: /add franchise/i }).click();
  await page
    .getByRole("textbox", { name: "Franchise name" })
    .fill("New Franchise");
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("franchisee@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();

  // Should see new franchise in list (table displays admin names, not emails)
  await expect(page.locator("table")).toContainText("New Franchise");
  await expect(page.locator("table")).toContainText("Franchisee Admin");
});

test("admin can delete a franchise", async ({ page }) => {
  await adminInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("admin@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("adminpass");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: /admin/i }).click();

  // Click close/delete franchise
  await page.getByRole("button", { name: /close/i }).first().click();
  await page.getByRole("button", { name: "Close" }).click();

  // Should not see deleted franchise
  await expect(page.locator("table")).not.toContainText("LotaPizza");
});

test("admin dashboard displays franchises and actions", async ({ page }) => {
  await adminInit(page);

  // Go through the login flow as admin
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("admin@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("adminpass");
  await page.getByRole("button", { name: "Login" }).click();

  // Navigate to admin dashboard
  await page.getByRole("link", { name: /admin/i }).click();

  // Check for franchises table and actions
  await expect(page.locator("h3")).toHaveText("Franchises");
  await expect(
    page.getByRole("button", { name: /add franchise/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /close/i }).first(),
  ).toBeVisible();

  // Check for filter input and pagination
  await expect(page.getByPlaceholder("Filter franchises")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "«" })).toBeVisible();
  await expect(page.getByRole("button", { name: "»" })).toBeVisible();
});

test("list and delete users", async ({ page }) => {
  await adminInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("admin@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("adminpass");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: /admin/i }).click();

  // Assert that the user list is present
  await expect(page.getByRole("heading", { name: "User List" })).toBeVisible();

  // Assert that at least one user row is present
  await expect(page.getByTestId("user-row").first()).toBeVisible();

  // Search for a user (simulate search input)
  await page.getByPlaceholder("Search users...").fill("Test User");
  await expect(page.getByTestId("user-row").first()).toBeVisible();

  // Click delete on the first user
  await page.getByTestId("delete-user").first().click();

  // Assert that the deleted user is no longer present
  await expect(page.getByText("Test User 1")).not.toBeVisible();

  // Test pagination: Next button
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByTestId("user-row").first()).toBeVisible();

  // Test pagination: Prev button
  await page.getByRole("button", { name: "Prev" }).click();
  await expect(page.getByTestId("user-row").first()).toBeVisible();
});
