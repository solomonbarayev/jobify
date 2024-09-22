import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/add-job", "/jobs(.*)", "/stats"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req))
    // If the route is not public, protect it
    auth().protect();
  // }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
