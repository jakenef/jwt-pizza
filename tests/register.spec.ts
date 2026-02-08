import { test, expect } from "playwright-test-coverage";
import { basicInit } from "./utils";

test("register", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByPlaceholder("Full name").fill("Test User");
  await page.getByPlaceholder("Email address").fill("testuser@jwt.com");
  await page.getByPlaceholder("Password").fill("testpass");
  await page.getByRole("button", { name: "Register" }).click();

  // Check that the Register page fields and Register button are still present and enabled
  await expect(page.getByPlaceholder("Full name")).toBeVisible();
  await expect(page.getByPlaceholder("Email address")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
  const registerButton = page.getByRole("button", { name: "Register" });
  await expect(registerButton).toBeVisible();
  await expect(registerButton).toBeEnabled();
});
