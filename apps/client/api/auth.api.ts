"use server";

import { User } from "@/types";
import { cookies } from "next/headers";

export const signUp = async (user: User) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/signup`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (user: User) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (data.token) {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const cookieStore = await cookies();

      cookieStore.set("session", data.token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
      });

      return { success: "token created" };
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};
