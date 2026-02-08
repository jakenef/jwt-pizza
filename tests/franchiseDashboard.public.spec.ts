import { test, expect } from "playwright-test-coverage";
import { basicInit } from "./utils";

test("franchise dashboard public view is visible", async ({ page }) => {
  await basicInit(page);

  // Go through the login flow as a regular diner
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  // Navigate to franchise dashboard
  await page
    .getByLabel("Global")
    .getByRole("link", { name: /franchise/i })
    .click();
  // Check for the specific public-facing heading
  const heading = page.getByRole("heading", { name: /piece of the pie/i, level: 2 });
  await expect(heading).toBeVisible();
  // Add more assertions for public content as needed
});
