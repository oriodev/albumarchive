import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./api/session.api";

export async function middleware(request: NextRequest) {
  // SET ROUTES.
  const loggedOutPages = ["", "login", "signup"];
  const loggedInPages = ["central"];
  const permanentLists = ["listened", "to-listen"];

  //   GET SESSION.
  const session = await getSession();

  //   GET PATHNAME.
  const pathname = request.nextUrl.pathname;
  const splitPath = pathname.split("/");
  const startOfPath = splitPath[1];
  const endOfPath = splitPath[splitPath.length - 1];

  //   STOPS LOGGED OUT USERS ACCESSING THE WEBSITE.
  if (loggedInPages.includes(startOfPath) && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //   STOPS LOGGED IN USERS ACCESSING AUTH PAGES.
  if (loggedOutPages.includes(startOfPath) && session) {
    return NextResponse.redirect(new URL("/central", request.url));
  }

  // STOPS USER FROM EDITING PERMANENT LISTS.
  if (
    endOfPath === "editing" &&
    permanentLists.includes(splitPath[splitPath.length - 2])
  ) {
    return NextResponse.redirect(
      new URL(`/central/lists/${splitPath[splitPath.length - 2]}`, request.url),
    );
  }

  return NextResponse.next();
}
