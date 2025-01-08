import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./api/session.api";

export async function middleware(request: NextRequest) {
  // SET ROUTES.
  const loggedOutPages = ["", "login", "signup"];
  const loggedInPages = ["central"];

  //   GET SESSION.
  const session = await getSession();

  //   GET PATHNAME.
  const pathname = request.nextUrl.pathname;
  const startOfPath = pathname.split("/")[1];

  //   STOPS LOGGED OUT USERS ACCESSING THE WEBSITE.
  if (loggedInPages.includes(startOfPath) && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //   STOPS LOGGED IN USERS ACCESSING AUTH PAGES.
  if (loggedOutPages.includes(startOfPath) && session) {
    return NextResponse.redirect(new URL("/central", request.url));
  }

  return NextResponse.next();
}
