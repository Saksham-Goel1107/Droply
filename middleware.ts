import {
  clerkMiddleware,
  createRouteMatcher,
  auth,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isBasic=createRouteMatcher(['/careers(.*)','/contact(.*)','/cookies(.*)','/pricing(.*)','/features(.*)','/privacy(.*)','/terms(.*)','/about(.*)'])

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)","/forgot-password(.*)","/reset-password(/*)"]);

export default clerkMiddleware(async (auth, request) => {
  const user = auth();
  const userId = (await user).userId;
  const url = new URL(request.url);

  if (userId && isPublicRoute(request) && url.pathname !== "/" && !isBasic(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect non-public routes
  if (!isPublicRoute(request) && !isBasic(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
