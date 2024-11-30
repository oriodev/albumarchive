"use server";

import { getSession } from "./session.api";

export const getUserId = async () => {
  try {
    const token = await getSession();

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();
      return user.id;
    }

    return { error: "no user located" };
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getUser = async (id: string) => {
  try {
    const token = await getSession();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/${id}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = await response.json();
      return {
        username: user.username,
        email: user.email,
      };
    }

    return null;
  } catch (error) {
    console.log("error: ", error);
  }
};
