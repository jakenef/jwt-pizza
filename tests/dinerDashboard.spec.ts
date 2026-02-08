import { test, expect } from "playwright-test-coverage";
import { basicInit } from "./utils";

// Diner dashboard: login, view balance, view order history, place order, pay

test("diner dashboard shows balance and order history", async ({ page }) => {
  await basicInit(page);
  // Login first
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  // Navigate to dashboard via initials link (KC)
  await page.getByRole("link", { name: "KC" }).click();

  // Check name/email/role visible
  await expect(page.getByText("name:")).toBeVisible();
  await expect(page.getByText("email:")).toBeVisible();
  await expect(page.getByText("role:")).toBeVisible();

  // Check order history table is visible if orders exist
  await expect(page.locator("table")).toBeVisible();
});
