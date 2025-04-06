"use server";

import { UserLogin, UserSignUp } from "@/types";
import { deleteSession } from "./session.api";

export const signUp = async (user: UserSignUp) => {
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

export const login = async (user: UserLogin) => {
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

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    deleteSession();
  } catch (error) {
    console.log(error);
  }
};
