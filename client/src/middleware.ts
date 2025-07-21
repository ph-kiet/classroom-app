import { NextRequest, NextResponse } from "next/server";

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/account-setup",
  "/sign-in/student",
  "/not-found",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;

  // If no token, redirect to sign-in unless already on an auth route
  if (!token) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    // Decode JWT payload
    const decoded = decodeJwtPayload(token);

    // If decoding fails or payload is invalid, redirect to sign-in
    if (!decoded || !decoded.role || typeof decoded.exp !== "number") {
      console.error("Invalid JWT payload");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Check if token is expired (optional, as jwt.verify throws for expired tokens)
    const isExpired = Date.now() >= decoded.exp * 1000;
    if (isExpired) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Redirect authenticated users away from auth routes
    if (authRoutes.includes(pathname)) {
      const redirectPath =
        decoded.role === "instructor" ? "/students" : "/lessons";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Restrict students from accessing /students
    if (pathname.startsWith("/students") && decoded.role === "student") {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// Function to decode JWT payload
function decodeJwtPayload(
  token: string
): { role?: string; exp?: number } | null {
  try {
    const payload = token.split(".")[1]; // Get payload part
    const decodedPayload = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString();
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
