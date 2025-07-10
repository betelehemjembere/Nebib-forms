import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

const PROD_BASE_URL = "https://nebib-forms-production.up.railway.app";

export default async function authMiddleware(request: NextRequest) {
  try {
    // Use production URL if running in production, otherwise use origin
    const isProd = request.nextUrl.hostname.endsWith("railway.app");
    const baseURL = isProd ? PROD_BASE_URL : request.nextUrl.origin;

    const { data: session, error } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (error) {
      console.error("Session fetch error:", error);
    }

    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/form-generator(.*)", "/form-management(.*)", "/generate-form(.*)"],
};
