import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      organizationName: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    "https://localhost:8080",
    "https://nebib-forms-production.up.railway.app",
  ],
});
