// @ts-ignore
import { test, expect } from "playwright-test-coverage";
import { Role, User } from "../src/service/pizzaService";
import { Page } from "@playwright/test";

export async function basicInit(page: Page) {
  // Combined handler for /api/franchise (GET, POST)
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      await route.fulfill({ json: { id: 99, ...body } });
      return;
    }
    // GET: return standard franchises and stores
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: "LotaPizza",
          admins: [
            { id: "4", name: "Fran Owner", email: "franchisee@jwt.com" },
          ],
          stores: [
            { id: 4, name: "Lehi", totalRevenue: 0.01 },
            { id: 5, name: "Springville", totalRevenue: 0.02 },
          ],
        },
        { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
        { id: 4, name: "topSpot", stores: [] },
      ],
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  // Combined handler for /api/franchise/:id (GET, DELETE)
  await page.route(/\/api\/franchise\/(\d+)$/, async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 200, json: { success: true } });
      return;
    }
    // GET: return franchise by id
    const match = route
      .request()
      .url()
      .match(/\/api\/franchise\/(\d+)$/);
    const id = match ? match[1] : undefined;
    let franchise: any[] | null = null;
    if (id === "4") {
      franchise = [
        {
          id: 2,
          name: "LotaPizza",
          admins: [
            { id: "4", name: "Fran Owner", email: "franchisee@jwt.com" },
          ],
          stores: [
            { id: 4, name: "Lehi", totalRevenue: 0.01 },
            { id: 5, name: "Springville", totalRevenue: 0.02 },
          ],
        },
      ];
    } else {
      franchise = [];
    }
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchise });
  });

  // Mock deleting a store
  await page.route(/\/api\/franchise\/\d+\/store\/\d+$/, async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 200, json: { success: true } });
      return;
    }
    await route.fallback();
  });

  // Mock creating a store
  await page.route(/\/api\/franchise\/\d+\/store$/, async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      await route.fulfill({ json: { id: 99, ...body } });
      return;
    }
    await route.fallback();
  });

  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    "d@jwt.com": {
      id: "3",
      name: "Kai Chen",
      email: "d@jwt.com",
      password: "a",
      roles: [{ role: Role.Diner }],
    },
    "franchisee@jwt.com": {
      id: "4",
      name: "Fran Owner",
      email: "franchisee@jwt.com",
      password: "franpass",
      roles: [{ role: Role.Franchisee }, { role: Role.Diner }],
    },
  };

  // Authorize login for the given user
  await page.route("*/**/api/auth", async (route) => {
    const req = route.request().postDataJSON();
    if (route.request().method() === "POST") {
      // Registration logic
      if (!req.email || !req.password || !req.name) {
        await route.fulfill({ status: 400, json: { error: "Missing fields" } });
        return;
      }
      if (validUsers[req.email]) {
        await route.fulfill({
          status: 409,
          json: { error: "User already exists" },
        });
        return;
      }
      const newUser: User = {
        id: Math.floor(Math.random() * 10000).toString(),
        name: req.name,
        email: req.email,
        password: req.password,
        roles: [{ role: Role.Diner }],
      };
      validUsers[req.email] = newUser;
      loggedInUser = newUser;
      await route.fulfill({ json: { user: newUser, token: "abcdef" } });
      return;
    }
    if (route.request().method() === "PUT") {
      // Login logic
      const user = validUsers[req.email];
      if (!user || user.password !== req.password) {
        await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
        return;
      }
      loggedInUser = validUsers[req.email];
      const loginRes = {
        user: loggedInUser,
        token: "abcdef",
      };
      await route.fulfill({ json: loginRes });
      return;
    }
  });

  await page.route("*/**/api/user/me", async (route) => {
    if (route.request().method() === "PUT") {
      const updateReq = route.request().postDataJSON();
      if (loggedInUser) {
        loggedInUser = { ...loggedInUser, ...updateReq };
      }
      await route.fulfill({ json: loggedInUser });
      return;
    }
    // GET: return the currently logged in user
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: loggedInUser });
  });

  await page.route(/\/api\/user\/\d+$/, async (route) => {
    if (route.request().method() === "PUT") {
      const updateReq = route.request().postDataJSON();
      if (loggedInUser) {
        // Remove old email entry if email changed

        if (updateReq.email && updateReq.email !== loggedInUser.email) {
          delete validUsers[loggedInUser.email as string];
        }
        loggedInUser = { ...loggedInUser, ...updateReq };
        if (loggedInUser) {
          validUsers[loggedInUser.email as string] = loggedInUser as User;
        }
      }
      await route.fulfill({ json: { user: loggedInUser, token: "abcdef" } });
      return;
    }
    await route.fallback();
  });

  // A standard menu
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  // Order history and order creation
  await page.route("*/**/api/order", async (route) => {
    if (route.request().method() === "GET") {
      // Return order history
      const orderHistory = {
        orders: [
          {
            id: 23,
            items: [
              { id: 1, title: "Veggie", price: 0.0038 },
              { id: 2, title: "Pepperoni", price: 0.0042 },
            ],
            date: new Date(),
          },
        ],
      };
      await route.fulfill({ json: orderHistory });
      return;
    }
    // POST: create order
    const orderReq = route.request().postDataJSON();
    const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: "eyJpYXQ",
    };
    expect(route.request().method()).toBe("POST");
    await route.fulfill({ json: orderRes });
  });

  await page.goto("/");
}

export async function adminInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    "admin@jwt.com": {
      id: "1",
      name: "Admin User",
      email: "admin@jwt.com",
      password: "adminpass",
      roles: [{ role: Role.Admin }],
    },
  };

  // Mock GET /api/user for user listing with enough users for pagination
  await page.route(/\/api\/user\?page=\d+&limit=\d+&name=.*/, async (route) => {
    if (route.request().method() === "GET") {
      const url = route.request().url();
      const params = new URLSearchParams(url.split("?")[1]);
      const page = parseInt(params.get("page") || "0");
      const limit = parseInt(params.get("limit") || "5");
      const name = params.get("name") || "*";
      // Generate 12 users for pagination
      const allUsers = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Test User ${i + 1}`,
        email: `user${i + 1}@jwt.com`,
        roles: [{ role: "diner" }],
      }));
      // Filter by name if not wildcard
      const filtered =
        name === "*"
          ? allUsers
          : allUsers.filter((u) => u.name.includes(name.replace(/\*/g, "")));
      const users = filtered.slice(page * limit, (page + 1) * limit);
      const more = (page + 1) * limit < filtered.length;
      await route.fulfill({ json: { users, more } });
      return;
    }
    await route.fallback();
  });

  // Authorize login for the given user
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    await route.fulfill({ json: loginRes });
  });

  // Return the currently logged in user
  await page.route("*/**/api/user/me", async (route) => {
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: loggedInUser });
  });

  // Standard franchises and stores, plus create/delete
  let franchises = [
    {
      id: 2,
      name: "LotaPizza",
      admins: [{ id: "1", name: "Admin User", email: "admin@jwt.com" }],
      stores: [
        { id: 4, name: "Lehi", totalRevenue: 0.01 },
        { id: 5, name: "Springville", totalRevenue: 0.02 },
      ],
    },
  ];

  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      const adminEmail =
        body.admins && body.admins[0] && body.admins[0].email
          ? body.admins[0].email
          : "franchisee@jwt.com";
      const newFranchise = {
        id: Math.floor(Math.random() * 1000) + 10,
        name: body.name,
        admins: [{ id: "2", email: adminEmail, name: "Franchisee Admin" }],
        stores: [],
      };
      franchises.push(newFranchise);
      await route.fulfill({ json: newFranchise });
      return;
    }
    // GET: return franchises
    await route.fulfill({ json: { franchises, more: false } });
  });

  await page.route(/\/api\/franchise\/(\d+)$/, async (route) => {
    if (route.request().method() === "DELETE") {
      const match = route
        .request()
        .url()
        .match(/\/api\/franchise\/(\d+)$/);
      const id = match ? parseInt(match[1]) : undefined;
      franchises = franchises.filter((f) => f.id !== id);
      await route.fulfill({ status: 200, json: { success: true } });
      return;
    }
    // GET: return franchise by id
    const match = route
      .request()
      .url()
      .match(/\/api\/franchise\/(\d+)$/);
    const id = match ? parseInt(match[1]) : undefined;
    const franchise = franchises.filter((f) => f.id === id);
    await route.fulfill({ json: franchise });
  });

  await page.goto("/");
}
