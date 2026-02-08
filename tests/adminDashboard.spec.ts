import { test, expect } from "playwright-test-coverage";
import { adminInit } from "./utils";

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
