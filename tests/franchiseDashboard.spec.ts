import { test, expect } from "playwright-test-coverage";
import { basicInit } from "./utils";

test("franchise dashboard management view for franchisee owner", async ({
  page,
}) => {
  await basicInit(page);

  // Go through the login flow as franchise owner
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("franchisee@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("franpass");
  await page.getByRole("button", { name: "Login" }).click();

  // Navigate to franchise dashboard
  await page
    .getByLabel("Global")
    .getByRole("link", { name: /franchise/i })
    .click();

  // Check for franchise management content (adjust selectors as needed)
  // After login, should see the LotaPizza dashboard
  await expect(
    page.getByRole("heading", { name: /lota/i, level: 2 }),
  ).toBeVisible();
  // The button to add a store may be labeled "Create store" or "Add store"
  await expect(
    page.getByRole("button", { name: /create store|add store/i }),
  ).toBeVisible();
  // There may be multiple "Close" buttons, so just check at least one is visible
  await expect(
    page.getByRole("button", { name: /close/i }).first(),
  ).toBeVisible();

  // --- Test creating a store ---
  // Click the "Create store" button
  await page.getByRole("button", { name: /create store/i }).click();
  // Should see the create store heading
  await expect(
    page.getByRole("heading", { name: /create store/i, level: 2 }),
  ).toBeVisible();
  // Fill out the store name
  await page.getByPlaceholder("store name").fill("Test Store");
  // Submit the form
  await page.getByRole("button", { name: /^create$/i }).click();
  // Should be redirected back to the franchise dashboard
  await expect(
    page.getByRole("heading", { name: /lota/i, level: 2 }),
  ).toBeVisible();

  // --- Test closing a store ---
  // Click the first "Close" button in the stores table (we're already on dashboard)
  await page.getByRole("button", { name: /close/i }).first().click();
  // Now on the close store confirmation page
  await expect(
    page.getByRole("heading", { name: /sorry to see you go/i, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByText(/are you sure you want to close the/i),
  ).toBeVisible();
  // Check that we're closing a store from LotaPizza franchise (Lehi or Springville)
  await expect(page.getByText(/store.*lehi|store.*springville/i)).toBeVisible();
  // Click the final Close button to confirm
  await page.getByRole("button", { name: /^close$/i }).click();
  // Should be redirected back to the franchise dashboard
  await expect(
    page.getByRole("heading", { name: /lota/i, level: 2 }),
  ).toBeVisible();
});
