import { test, expect } from "playwright-test-coverage";
import { basicInit } from "./utils";

test("register", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByPlaceholder("Full name").fill("Test User");
  await page.getByPlaceholder("Email address").fill("testuser@jwt.com");
  await page.getByPlaceholder("Password").fill("testpass");
  await page.getByRole("button", { name: "Register" }).click();

  // After registration, user should be redirected or see a welcome message
  // Adjust the assertion below based on actual app behavior after registration
  await expect(page.locator("main")).toContainText("Welcome");
});
