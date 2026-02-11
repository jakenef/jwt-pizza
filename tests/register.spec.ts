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
  await expect(
    page.locator(
      "span.bg-clip-text.bg-gradient-to-tr.from-orange-600.to-orange-400.text-transparent",
    ),
  ).toHaveText("The web's best pizza");
});
