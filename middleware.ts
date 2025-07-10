import { NextResponse, type NextRequest } from "next/server";

const PROD_BASE_URL = "https://nebib-forms-production.up.railway.app";

export default async function authMiddleware(request: NextRequest) {
  try {
    const isProd = request.nextUrl.hostname.endsWith("railway.app");
    const baseURL = isProd ? PROD_BASE_URL : request.nextUrl.origin;

    const sessionUrl = new URL("/api/auth/get-session", baseURL).toString();

    const res = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Session fetch failed:", res.status);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const { data: session } = await res.json();

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
