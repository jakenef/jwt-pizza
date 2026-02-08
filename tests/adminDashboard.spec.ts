import { test, expect } from "playwright-test-coverage";
import { basicInit } from "./utils";

test("admin dashboard displays franchises and actions", async ({ page }) => {
  await basicInit(page);

  // Simulate admin login
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("admin@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("adminpass");
  await page.getByRole("button", { name: "Login" }).click();

  // Go to admin dashboard
  await page.getByRole("link", { name: /admin dashboard/i }).click();

  // Check for franchises table and actions
  await expect(
    page.getByRole("heading", { name: /franchises/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /add franchise/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /close/i })).toBeVisible();

  // Check for filter input and pagination
  await expect(page.getByPlaceholder("Filter franchises")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "«" })).toBeVisible();
  await expect(page.getByRole("button", { name: "»" })).toBeVisible();
});
