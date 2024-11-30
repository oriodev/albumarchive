"use server";

import { cookies } from "next/headers";

export const createSession = async (token: string) => {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (sessionCookie) {
      return sessionCookie.value;
    }

    return { error: "no valid session" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteSession = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
  } catch (error) {
    console.log(error);
  }
};
