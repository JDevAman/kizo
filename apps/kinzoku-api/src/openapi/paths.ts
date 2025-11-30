import { registry } from "./registry";
import { z } from "zod";
import { 
  signupInput, 
  signinInput, 
  updateProfileInput,
  p2pTransferInput, 
  addMoneyInput,
  createRequestInput,
  dashboardOutput,
  transactionObj 
} from "@kinzoku/shared";

// ==========================================
// 1. USER & AUTH MODULE (Mounted at /user)
// ==========================================

registry.registerPath({
  method: "post",
  path: "/api/v1/user/signup", // Changed from /auth/signup
  summary: "Register a new user",
  tags: ["User Auth"],
  request: {
    body: {
      content: { "application/json": { schema: signupInput } },
    },
  },
  responses: {
    201: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            user: z.object({ id: z.string(), email: z.string(), role: z.string() }),
          }),
        },
      },
    },
    409: { description: "User already exists" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/user/signin", // Changed from /auth/signin
  summary: "Log in user",
  tags: ["User Auth"],
  request: {
    body: {
      content: { "application/json": { schema: signinInput } },
    },
  },
  responses: {
    200: { description: "Login successful (HttpOnly cookies set)" },
    401: { description: "Invalid credentials" },
  },
});

// --- GOOGLE OAUTH ---

registry.registerPath({
  method: "get",
  path: "/api/v1/auth/google",
  summary: "Login with Google",
  description: "Redirects user to Google OAuth consent screen",
  tags: ["OAuth"],
  responses: {
    302: {
      description: "Redirects to Google",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/auth/google/callback",
  summary: "Google Callback",
  description: "Google redirects back here. Sets HttpOnly cookies and closes popup.",
  tags: ["OAuth"],
  request: {
    query: z.object({
      code: z.string().describe("Authorization code from Google"),
      state: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Authentication successful (Returns HTML script)",
      content: {
        "text/html": { schema: z.string() }, // Documenting that it returns HTML
      },
    },
    401: { description: "Authentication failed" },
  },
});

// --- GITHUB OAUTH ---

registry.registerPath({
  method: "get",
  path: "/api/v1/auth/github",
  summary: "Login with GitHub",
  description: "Redirects user to GitHub OAuth consent screen",
  tags: ["OAuth"],
  responses: {
    302: {
      description: "Redirects to GitHub",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/auth/github/callback",
  summary: "GitHub Callback",
  description: "GitHub redirects back here. Sets HttpOnly cookies and closes popup.",
  tags: ["OAuth"],
  request: {
    query: z.object({
      code: z.string().describe("Authorization code from GitHub"),
    }),
  },
  responses: {
    200: {
      description: "Authentication successful (Returns HTML script)",
      content: {
        "text/html": { schema: z.string() },
      },
    },
    401: { description: "Authentication failed" },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/user/update-profile",
  summary: "Update Profile",
  tags: ["User Profile"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": { 
          schema: updateProfileInput // ✅ Imported from @kinzoku/shared
        },
      },
    },
  },
  responses: {
    200: {
      description: "Profile updated successfully",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    422: { description: "Invalid input data" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/user/refresh",
  summary: "Refresh Access Token",
  tags: ["User Auth"],
  responses: {
    200: { description: "Token refreshed successfully" },
    401: { description: "Refresh token missing" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/user/me",
  summary: "Get Current User Profile",
  tags: ["User Profile"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Profile Data",
      content: {
        "application/json": {
          schema: z.object({
            user: z.object({
              id: z.string(),
              firstName: z.string(),
              lastName: z.string(),
              email: z.string(),
              role: z.string(),
              avatar: z.string().nullable().optional(),
            }),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/user/logout",
  summary: "Logout user",
  tags: ["User Auth"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Logged out successfully" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/user/bulk",
  summary: "Search Users",
  tags: ["User Profile"],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({ filter: z.string() })
  },
  responses: {
    200: { description: "List of users" },
  },
});


// ==========================================
// 2. PAYMENTS / ACCOUNT MODULE (Mounted at /payments)
// ==========================================

registry.registerPath({
  method: "get",
  path: "/api/v1/payments/balance",
  summary: "Get Wallet Balance",
  tags: ["Payments"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Current Balance",
      content: {
        "application/json": { schema: z.object({ balance: z.number() }) },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/payments/add-money",
  summary: "Deposit Money (OnRamp)",
  tags: ["Payments"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: addMoneyInput } },
    },
  },
  responses: {
    200: { description: "Money added successfully" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/payments/transfer",
  summary: "Send Money (P2P)",
  tags: ["Payments"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: p2pTransferInput } },
    },
  },
  responses: {
    200: { description: "Transfer successful" },
    400: { description: "Insufficient funds" },
  },
});

// --- Payment Requests ---

registry.registerPath({
  method: "get",
  path: "/api/v1/payments/requests",
  summary: "Get Payment Requests",
  tags: ["Payment Requests"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "List of pending/history requests" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/payments/request/create",
  summary: "Create a Payment Request",
  tags: ["Payment Requests"],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: createRequestInput } } },
  },
  responses: {
    200: { description: "Request sent" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/payments/request/accept/{id}",
  summary: "Accept & Pay Request",
  tags: ["Payment Requests"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { description: "Request accepted and money transferred" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/payments/request/reject/{id}",
  summary: "Reject Request",
  tags: ["Payment Requests"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { description: "Request rejected" },
  },
});


// ==========================================
// 3. TRANSACTIONS MODULE (Mounted at /transactions)
// ==========================================

registry.registerPath({
  method: "get",
  path: "/api/v1/transactions",
  summary: "List Transactions History",
  tags: ["Transactions"],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      filter: z.enum(["sent", "received", "pending", "all"]).optional(),
      limit: z.string().optional(),
      skip: z.string().optional(),
      search: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Paginated list",
      content: {
        "application/json": {
          schema: z.object({
            transactions: z.array(transactionObj),
            total: z.number(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/transactions/export",
  summary: "Download CSV",
  tags: ["Transactions"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "CSV Download",
      content: { "text/csv": { schema: z.string() } },
    },
  },
});

// Note: Express matches routes in order. 
// If /export is above /:id in router, this works fine.
registry.registerPath({
  method: "get",
  path: "/api/v1/transactions/{id}",
  summary: "Get Transaction Details",
  tags: ["Transactions"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: "Transaction details",
      content: { "application/json": { schema: transactionObj } },
    },
    404: { description: "Not found" },
  },
});

// ==========================================
// 4. DASHBOARD MODULE (Mounted at /dashboard)
// ==========================================

registry.registerPath({
  method: "get",
  path: "/api/v1/dashboard",
  summary: "Get Dashboard Stats",
  tags: ["Dashboard"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Dashboard stats",
      content: { "application/json": { schema: dashboardOutput } },
    },
  },
});