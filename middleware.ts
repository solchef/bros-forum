import { NextResponse } from "next/server";
// Import any necessary functions to get user data
import { useInitData } from "@telegram-apps/sdk-react"; // Adjust according to your setup

export function middleware(req: { url: string | URL | undefined; }) {
  // Replace useInitData with a method that retrieves user data for middleware
  const user = {
    id: "currentUser?.id.toString()",
    firstName: "currentUser?.firstName",
    lastName: "currentUser?.lastName",
    photoUrl: "currentUser?.photoUrl",
    username: "currentUser?.username",
  }; /* logic to get user from request, e.g., session or JWT token */;

  // Check if the user is authenticated
  if (!user) {
    // Redirect to a sign-in page or return a response
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

// Public routes that do not require authentication
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
