import { db } from "@/db/index.js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://batchit-ylix.vercel.app",
  ],
  basePath: "/api/auth",
  advanced: {
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        },
      },
    },
  },
});